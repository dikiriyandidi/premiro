'use strict'

const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;

/**

 * RENDER ARTICLE LIST
 * - render to view
 */
exports.view = (req, res, next) => {
    (async () => {
        // - render to views
        res.render('article', {

        })
    })().catch(next)
}

/**

 * DATATABLE ARTICLE
 */
exports.datatable = (req, res, next) => { 
    (async () => {
        let data = await req.queries('article').datatable(req.db, req)

        if (data != null) {
            for (let i in data.data) {
                data.data[i].publishdate = req.lib("timehelper").formatYmdHis(data.data[i].publishdate)
            }
            res.json(data)
        } else {
            res.error("Data not found",200)
        }
    })().catch(next)
}

/**

 * DATATABLE ARTICLE EXPORT
 */
exports.export = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            export:[
                {url:"/cms/article/export"}
            ]
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        let data = await req.queries('article').datatable(req.db, req)
        if(!data || data.data.length == 0) {
            return res.error("Data not found",200)
        } else {
            for (let i in data.data) {
                data.data[i].publishdate = req.lib("timehelper").formatYmdHis(data.data[i].publishdate)
            }
        }

        let currentDate = req.lib("timehelper").formatYmdhis()
        
        let fields = ['id', 'string_id', 'title', 'content', 'preview_content','is_highlight','publishdate']

        let json2csvParser = new Json2csvParser({
            fields,
            delimiter: ';'
        });
        let csv = json2csvParser.parse(data.data);

        res.set('Content-Type', 'application/octet-stream')
        res.attachment(currentDate + '.csv')
        res.status(200).send(csv)
    })().catch(next)
}

/**

 * RENDER FORM ARTICLE
 * - get article detail if id is undefined
 * - render to view
 */

exports.form = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{url:"/cms/article/detail"}],
            add:[{url:"/cms/article/new"}],
        })

        if(!uacAction.status){
            return res._userActionRespond()
        }

     // - get event detail if id is undefined
        let data = {}

        if (req.params.id !== undefined && req.params.id !== '') {
            data = await req.queries('article').getArticleByStringId(req.db, req.params.id)

            if (data != null) {
                if (data.featured_image !== '') {
                    let featured_image = data.featured_image
                    data.featured_image = myConfig.base_url + '/images/article/i/' + featured_image
                    data.dataValues.featured_image_th = myConfig.base_url + '/images/article/i/' + featured_image // + '.webp'
                }

                if (data.video_file !== '') {
                    let video_file = data.video_file
                    data.video_file = myConfig.base_url + '/video/article/v/' + video_file
                }

                if (data.video_cover !== '') {
                    let video_cover = data.video_cover
                    data.video_cover = myConfig.base_url + '/video/article/v/th/' + video_cover // + '.webp'
                }

                data.dataValues.publishdate = req.lib("timehelper").formatYmdHis(data.publishdate)
            } else {
                res.status(404).render('404_cms', {})
                return
            }
        }

        // - render to views
        res.render('article_form', {
            data,
        })
    })().catch(next)
}

/**

 * MANAGE ARTICLE
 * - validate request data value
 * - check if folder image exist
 * - check if image exist
 * - set allowed mime
 * - validate mime type
 * - validate dimension
 * - upload file to selected folder
 * - get string value
 * - save to database
 * - return response based on id
 */


/**

 * - Content required
 * - Preview Content required
 * - Featured image required
 * - Video & video cover required
 */
exports.manage = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/article/manage",
                options:{
                    checkInputHasId:true,fieldId:"id"
                }
            }],
            add:[{
                url:"/cms/article/manage",
                options:{
                    checkInputHasId:true,fieldId:"id",fieldValue:""
                }
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        // - validate request data value
        let param = [{
                name: 'title',
                rules: [
                    'required'
                ]
            }, {
                name: 'content',
                rules: [
                    'required'
                ]
            }, {
                name: 'preview_content',
                rules: [
                    'required'
                ],
                message: 'Field preview content is required.'
            },
            {
                name: 'publishdate',
                rules: [
                    'required'
                ],
                message: 'Field publish date is required.'
            }
        ]

        req.validate(req, param)

        if (req.body.content == "<p><br></p>") {
            res.error("Content Required",400)
            return
        }

        if (req.body.preview_content == "<p><br></p>") {
            res.error("Preview Content Required",400)
            return
        }
        

        let article_id = req.body.id;

        if(!article_id){
            article_id = "0"
        }

        let current_data = await req.queries('article').getArticleById(req.db, parseInt(article_id))

        if(current_data == null){
            current_data = {}
            current_data.video_cover = ''
            current_data.video_file = ''
            current_data.featured_image = ''
        }

        if (req.body.type == "video" && ((current_data.video_cover == '' || current_data.video_file == '') && (req.body.video_file == "undefined" || req.body.video_cover == "undefined"))) {
            if (current_data.video_file == '' && req.body.video_file == "undefined") {
                res.error("Video Required",400)
                return
            } else if (current_data.video_cover == '' && req.body.video_cover == "undefined") {
                res.error("Video Cover Required",400)
                return
            }
        } 
        
        else if (req.body.type == "image" && (current_data.featured_image == '' && req.body.featured_image == "undefined")) {
            res.error("Image Required",400)
            return
        }

        // - check if folder image exist
        let root_loc = req.rootpath + '/uploads/'
        let article_loc = req.rootpath + '/uploads/images/article/'
        let image_loc = req.rootpath + '/uploads/images/article/i/'
        let video_loc = req.rootpath + '/uploads/video/article/v/'

        if (!fs.existsSync(root_loc)) {
            fs.mkdirSync(root_loc, { recursive: true })
        }
        if (!fs.existsSync(article_loc)) {
            fs.mkdirSync(article_loc, { recursive: true })
        }
        if (!fs.existsSync(image_loc)) {
            fs.mkdirSync(image_loc, { recursive: true })
            fs.mkdirSync(image_loc + 'th/', { recursive: true })
        }
        if (!fs.existsSync(video_loc)) {
            fs.mkdirSync(video_loc, { recursive: true })
            fs.mkdirSync(video_loc + 'th/', { recursive: true })
        }

        // - check if image exist
        let type = req.body.type
        let required_text = (type == 'image' ? 'Featured Image' : 'Video & Video Cover')
        req.body.featured_image = req.body.video_file = req.body.video_cover = ''
        if (typeof req.files != 'undefined') {
            // - set allowed mime
            let image_mime = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
            let video_mime = ['video/mp4'];

            let required_image = false
            let required_video = false

            if (req.files.length != 0) {
                for (let i in req.files) {
                    if (type == 'image') {
                        if (req.files[i].fieldname == 'featured_image') {
                            required_image = true

                            // - validate mime type
                            if (req.lib('image_helper').validateMimeType(req.files[i], image_mime) === false) {
                                res.error("Featured Image type must be: jpg, png, gif, jpeg!",400)
                                return
                            }

                            // - validate dimension
                            let validateDimension = await req.lib('image_helper').validateDimension(req.files[i].path, 'equal', 380, 240)
                            if (validateDimension === false) {
                                res.error("Featured Image dimension must be: 380 x 240!",400)
                                return
                            }
                        }
                    } else if (type == 'video') {
                        if (req.files[i].fieldname == 'video_file') {
                            required_video = true

                            // - validate mime type
                            if (req.lib('image_helper').validateMimeType(req.files[i], video_mime) === false) {
                                res.error("Video type must be: mp4!",400)
                                return
                            }

                            // - validate file size
                            if (req.files[i].size > 201457280) {
                                res.error("Video file size must be below 200mb!",400)
                                return
                            }
                        }

                        if (req.files[i].fieldname == 'video_cover') {
                            required_image = true

                            // - validate mime type
                            if (req.lib('image_helper').validateMimeType(req.files[i], image_mime) === false) {
                                res.error("Video Cover type must be: jpg, png, gif, jpeg!",400)
                                return
                            }
                        }
                    }
                }


                required_image = (type == 'video' && required_video === false ? false : required_image)
                if (req.body.id == '' && required_image == false) {
                    res.error(required_text + ' is required',200)
                    return
                }

                // - upload file to selected folder
                for (let i in req.files) {
                    if (req.files[i].fieldname == 'featured_image') {
                        req.body.featured_image = await req.move_uploaded_file(req, 'featured_image', image_loc, 'image', false, true, image_mime, true)
                        if (req.body.featured_image === "Invalid") {
                            res.error("Featured image has invalid file type!",400)
                            return
                        }

                        let image_dir = image_loc + req.body.featured_image
                        let image_th_loc = image_loc + 'th/' + req.body.featured_image
                        req.lib('image_helper').resizeImage(image_dir, image_th_loc, 100)
                    }

                    if (req.files[i].fieldname == 'video_file') {
                        req.body.video_file = await req.move_uploaded_file(req, 'video_file', video_loc, 'video', false, false, video_mime)
                        if (req.body.video_file === "Invalid") {
                            res.error("Video has invalid file type!",400)
                            return
                        }
                    }

                    if (req.files[i].fieldname == 'video_cover') {
                        req.body.video_cover = await req.move_uploaded_file(req, 'video_cover', video_loc + 'th/', 'image', false, true, image_mime,true)
                        if (req.body.video_cover === "Invalid") {
                            res.error("Video cover has invalid file type!",400)
                            return
                        }
                    }
                }
            } else if (req.body.id == '') {
                res.error(required_text + ' is required',200)
                return
            }
        } else if (req.body.id == '') {
            res.error(required_text + ' is required',200)
            return
        }

        // - get string value
        if (req.body.id == null || req.body.id == '') {
            req.body.string_id = await req.lib('build_string_id').createStringId(req.db,req.body.title, 'article')
        }

        // - save to database
        req.queries('article').manage(req.db, req.body)

        // - return response based on id
        let message = 'Success Insert Data'
        if (req.body.id != null && req.body.id != '') {
            message = 'Success Update Data'
        }

        res.success({
            message: message
        })
    })().catch(next)
}

/**

 * DESTROY BANNER
 * - validate request data value
 * - save to database
 */
exports.destroy = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            delete:[
                {url:"/cms/article/destroy"}
            ]
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        // - validate request data value
        if (req.params.id == undefined || req.params.id == '' || req.params.id == null) {
            return res.error('Delete data failed',200);
        }

        // let param = [{
        //     name: 'id',
        //     rules: [
        //         'required'
        //     ]
        // }]

        // req.validate(req, param)

        // - save to database
        req.queries('article').destroy(req.db, req.params.id)

        res.success({
            message: 'Success delete data'
        })
    })().catch(next)
}