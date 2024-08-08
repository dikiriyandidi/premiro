'use strict'

const fs = require('fs');

// - EXAMPLE UPLOAD FILE TO CLOUD STORAGE
// const bucket_directory = 'uploads/images/article/i/'
// const cs_config = {
//     cs_name: myConfig.cs_name[0],
//     cs_bucket_domain: myConfig.cs_bucket_domain[0],
//     cs_bucket_name: myConfig.cs_bucket_name[0],
//     cs_region: myConfig.cs_region[0],
//     cs_access_key_id: myConfig.cs_access_key_id[0],
//     cs_access_key_secret: myConfig.cs_access_key_secret[0]
// }

exports.uploadImage = (req, res, next) => {
    (async () => {
        res.render('upload_image', {

        })
    })().catch(next)
}

exports.datatableImage = (req, res, next) => {
    (async () => {
        let data = await req.queries('data_image').datatableImage(req.db, req)

        for (let i = 0; i < data.data.length; i++) {
            data.data[i].url = myConfig.base_url + '/images/data_image/' + data.data[i].url; //+ '.webp';
            data.data[i].created_date = req.lib("timehelper").formatYmdHis(data.data[i].created_date)

            // - EXAMPLE UPLOAD FILE TO CLOUD STORAGE
            // data.data[i].url = cs_config.cs_bucket_domain + bucket_directory + data.data[i].url;
        }

        if (data != null) {
            res.json(data)
        } else {
            res.error("Data not found",200)
        }
    })().catch(next)
}

exports.manageImage = (req, res, next) => {
    (async () => {

        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            add:[{url:"/cms/upload_image/manage_image"}],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }
        
        let param = [{
            name: 'image',
            rules: [
                'required'
            ],
            message: 'Image is required.'
        }, ]
        if (typeof req.files == 'undefined' || req.files.length === 0) {
            req.body.image = undefined
        } else {
            req.body.image = 'image'
        }

        req.validate(req, param)
        // - check if folder image exist
        let new_loc = req.rootpath + '/uploads/images/data_image/'

        if (!fs.existsSync(new_loc)) {
            fs.mkdirSync(new_loc);
        }

        // - check if image exist
        if (typeof req.files != 'undefined') {
            // - set allowed mime
            let enable_mime = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

            req.body.image = ''
            if (req.files.length != 0) {
                // - validate mime type
                if (req.lib('image_helper').validateAllMimeType(req.files, enable_mime) === false) {
                    res.error("Image type must be: jpg, png, gif, jpeg!",400)
                    return
                }

                // - upload file to selected folder
                for (let i in req.files) {

                    req.body.image = await req.move_uploaded_file(req, 'image', new_loc, 'image', false, true, enable_mime, false, true)
                    if (req.body.image === "Invalid") {
                        res.error("Image On has invalid file type!",400)
                        return
                    }

                    // - EXAMPLE UPLOAD FILE TO CLOUD STORAGE
                    // if (req.files[i].fieldname == 'image') {
                    //     req.body.image = await req.move_uploaded_file_cs(req, 'image', bucket_directory, 'image', cs_config, enable_mime, false) // Example Upload Image
                    //     req.body.image = await req.move_uploaded_file_cs(req, 'image', bucket_directory, 'others', cs_config, ['text/plain'], false) Example Upload .txt Files
                    // }

                    // - YOU MAY USE THIS HELPER TO GET S3 CONFIG
                    // let bucket_directory = (ENV!="production") ? `images_${ENV}/` : "images/";
                    // let cs_config = req.lib("config").s3Config(myConfig,0)
                    
                    // UPLOAD CONVERTED FILE TO CLOUD
                    // let storagePath = await req.move_uploaded_file_cs(req, 'image', bucket_directory, 'video', cs_config, false, true)
                    // req.body.image = storagePath
                }
            }
        }

        // - save to database
        req.queries('data_image').manageImage(req.db, req.body)

        // - return response based on id
        let message = 'Success insert data'
        if (req.body.id != null && req.body.id != '') {
            message = 'Success update data'
        }

        res.success({
            message: message
        })
    })().catch(next)
}
