'use strict'

const fs = require('fs');
const ics = require('ics');
const myConfig = require('../../config/' + ENV + '/config.js')

/**

 * RENDER EVENT LIST PAGE
 * - render to view
 */
exports.eventView = (req, res, next) => {
    (async () => {
        // - render to views
        res.render('event', {

        })
    })().catch(next)
}

/**

 * RENDER FORM EVENT
 * - get city list from database
 * - get event detail if id is undefined
 * - render to view
 */
exports.form = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{url:"/cms/event/event_list/detail"}],
            add:[{url:"/cms/event/event_list/new"}],
        })

        if(!uacAction.status){
            return res._userActionRespond()
        }
        
        // - get city list from database
        let cities = await req.queries('masterdata').getPublishEventCity(req.db)

        // - get event detail if id is undefined
        let data = {};
        data.dataValues = {}
        if (req.params.id !== undefined && req.params.id !== '') {
            data = await req.queries('event').getEventByStringId(req.db, req.params.id)

            if (data != null) {
                if (data.featured_image !== '') {
                    let featured_image = data.featured_image
                    data.featured_image = myConfig.base_url + '/images/event/' + featured_image
                    data.dataValues.featured_image_th = myConfig.base_url + '/images/event/th/' + featured_image
                }

                let starttime = req.lib("timehelper").formatHis(data.startdate)
                let endtime = req.lib("timehelper").formatHis(data.enddate)
                let emptytime = (starttime == '00:00' && endtime == '23:59' ? true : false)

                data.dataValues.startdate = req.lib("timehelper").formatYmdCustom(data.startdate)
                data.dataValues.enddate = req.lib("timehelper").formatYmdCustom(data.enddate)
                data.dataValues.starttime = (emptytime == true ? '' : starttime)
                data.dataValues.endtime = (emptytime == true ? '' : endtime)
                data.dataValues.publish_date = req.lib("timehelper").formatYmdHis(data.publish_date)
            } else {
                res.status(404).render('404_cms', {})
                return
            }
        }

        // - render to views
        res.render('event_form', {
            cities: cities,
            data: data
        })
    })().catch(next)
}

/**

 * DATATABLE EVENT
 */
exports.eventDatatable = (req, res, next) => {
    (async () => {
        let data = await req.queries('event').eventDatatable(req.db, req)

        if (data != null) {
            for (let i in data.data) {
                let thumbnail = ''
                if (data.data[i].featured_image !== '') {
                    thumbnail = myConfig.base_url + '/images/event/th/' + data.data[i].featured_image
                    thumbnail = '<img src="' + thumbnail + '" alt="th" width="100%" />'
                }

                data.data[i].featured_image = thumbnail
                data.data[i].startdate = req.lib("timehelper").formatYmdCustom(data.data[i].startdate)
                data.data[i].enddate = req.lib("timehelper").formatYmdCustom(data.data[i].enddate)
            }
            res.json(data)
        } else {
            res.error("Data not found",200)
        }
    })().catch(next)
}
 
// Created by Willy
exports.addNewForm = (req, res, next) => {
    (async () => {
        // - get city list from database
        let cities = await req.queries('masterdata').get_all_event_city(req.db)

        // - render to views
        res.render('event_form', {
            cities: cities
        })
    })().catch(next)
}

/**

 * MANAGE EVENT
 * - validate request data value
 * - check if folder image exist
 * - check if featured image exist
 * - set allowed mime
 * - validate mime type
 * - upload file to selected folder
 * - upload thumbnail file to selected folder
 * - convert date
 * - validate date
 * - get string value
 * - save to database
 * - create ics file
 * - return response based on id
 */

/**

 * - Startdate cannot be bigger than end date
 * - turn off ics  
 */

exports.eventManage = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/event/event_list/manage",
                options:{
                    checkInputHasId:true,fieldId:"id"
                }
            }],
            add:[{
                url:"/cms/event/event_list/manage",
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
                name: 'city_id',
                rules: [
                    'required'
                ],
                message: 'Field city is required.'
            }, {
                name: 'startdate',
                rules: [
                    'required'
                ],
                message: 'Field start date is required.'
            },
            {
                name: 'starttime',
                rules: [
                    'required'
                ],
                message: 'Field start time is required.'
            },
            {
                name: 'endtime',
                rules: [
                    'required'
                ],
                message: 'Field end time is required.'
            },
            {
                name: 'enddate',
                rules: [
                    'required'
                ],
                message: 'Field end date is required.'
            }, {
                name: 'publish_date',
                rules: [
                    'required'
                ],
                message: 'Field publish date is required.'
            }, {
                name: 'status',
                rules: [
                    'required'
                ]
            },
            {
                name: 'venue',
                rules: [
                    'required'
                ]
            }
        ]
        req.validate(req, param)

        let start_date_format = req.body.startdate + " " + req.body.starttime
        let end_date_format = req.body.enddate + " " + req.body.endtime
        let difference = req.lib("timehelper").diffDate(start_date_format, end_date_format)

        if (difference.date < 0 || difference.hour < 0 || difference.minute < 0) {
            res.error('End date cannot be greater than start date',400)
            return
        }

        // - check if folder image exist
        let new_loc = req.rootpath + '/uploads/images/event/'

        if (!fs.existsSync(new_loc)) {
            fs.mkdirSync(new_loc);
            fs.mkdirSync(new_loc + 'th/');
            fs.mkdirSync(new_loc + 'cal/');
        }

        // - check if featured image exist
        req.body.featured_image = ''
        if (typeof req.files != 'undefined') {
            // - set allowed mime
            let enable_mime = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

            if (req.files.length != 0) {
                for (let i in req.files) {
                    if (req.files[i].fieldname == 'image') {
                        // - validate mime type
                        if (req.lib('image_helper').validateMimeType(req.files[i], enable_mime) === false) {
                            res.error("Featured Image type must be: jpg, png, gif, jpeg!",400)
                            return
                        }
                    }
                }

                // - upload file to selected folder
                req.body.featured_image = await req.move_uploaded_file(req, 'image', new_loc, 'image', false, false, enable_mime)
                if (req.body.featured_image === "Invalid") {
                    res.error("Featured Image has invalid file type!",400)
                    return
                }

                // - upload thumbnail file to selected folder
                let featured_image_dir = new_loc + req.body.featured_image
                let th_loc = new_loc + 'th/' + req.body.featured_image
                req.lib('image_helper').resizeImage(featured_image_dir, th_loc, 100)
            } else if (req.body.id == '') {
                res.error("Featured Image Required",200)
                return
            }
        } else if (req.body.id == '') {
            res.error("Featured Image Required",200)
            return
        }

        // - convert date
        let startdate = req.body.startdate
        let enddate = req.body.enddate
        let starttime = req.body.starttime = (req.body.starttime == '' ? '00:00' : req.body.starttime)
        let endtime = req.body.endtime = (req.body.endtime == '' ? '23:59' : req.body.endtime)

        // - validate date
        // let is_past = req.lib("timehelper").diffDate('',startdate)
        // if(is_past.date < 0 || is_past.hour < 0 || is_past.minute < 0){
        //     res.error('Start date cannot be smaller than today')
        //     return
        // }

        // - get string value
        if (req.body.id == null || req.body.id == '') {
            req.body.string_id = await req.lib('build_string_id').createStringId(req.db,req.body.title, 'event')
        }

        // - save to database
        req.queries('event').eventManage(req.db, req.body)

        // - create ics file
        let s_date = startdate.split('-')
        let s_time = starttime.split(':')

        let e_date = enddate.split('-')
        let e_time = endtime.split(':')

        // ics.createEvent({
        //     title: req.body.title,
        //     start: [s_date[0], s_date[1], s_date[2], s_time[0], s_time[1]],
        //     end: [e_date[0], e_date[1], e_date[2], e_time[0], e_time[1]],
        //     description: req.body.description,
        //     location: req.body.venue,
        //     url: myConfig.client_url + 'event/' + req.body.string_id

        // }, (error, value) => {
        //     if (error) {
        //         // res.error(error)
        //         // return
        //         console.log(error)
        //     }
        //     fs.writeFileSync(new_loc + 'cal/' + req.body.string_id + '.ics', value)
        // })

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

 * DESTROY ROLE
 * - validate request data value
 * - save to database
 */
exports.eventDestroy = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            delete:[{
                url:"/cms/event/event_list/destroy"
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        let id = req.params.id;

        // - validate request data value
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required');
            return
        }

        // - save to database
        req.queries('event').eventDestroy(req.db, id)

        res.success({
            message: 'Success delete data'
        })
    })().catch(next)
}

/**

 * RENDER EVENT CITY LIST PAGE
 * - render to view
 */
exports.cityView = (req, res, next) => {
    (async () => {
        // - render to views
        res.render('event_city', {

        })
    })().catch(next)
}

/**

 * DATATABLE EVENT
 */
exports.cityDatatable = (req, res, next) => {
    (async () => {
        let data = await req.queries('event').cityDatatable(req.db, req)

        if (data != null) {
            res.json(data)
        } else {
            res.error("Data not found",200)
        }
    })().catch(next)
}

/**

 * MANAGE EVENT CITY
 * - validate request data value
 * - validate city name
 * - save to database
 * - return response based on id
 */
exports.cityManage = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/event/city_list/manage",
                options:{
                    checkInputHasId:true,fieldId:"id"
                }
            }],
            add:[{
                url:"/cms/event/city_list/manage",
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
            name: 'city_name',
            rules: [
                'required'
            ],
            message: 'Field city name is required.'
        }, {
            name: 'status',
            rules: [
                'required'
            ]
        }]
        req.validate(req, param)

        // - validate city name
        let is_exist = await req.queries('event').isCityExist(req.db, req.body)
        if (is_exist > 0) {
            res.error('City name already exist',400)
            return
        }

        // - save to database
        req.queries('event').eventCityManage(req.db, req.body)

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

/**

 * DESTROY ROLE
 * - validate request data value
 * - save to database
 */
exports.cityDestroy = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            delete:[{
                url:"/cms/event/city_list/destroy"
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        // - validate request data value
        let id = req.params.id;

        // - validate request data value
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required');
            return
        }

        // - save to database
        req.queries('event').eventCityDestroy(req.db, id)

        res.success({
            message: 'Success delete data'
        })
    })().catch(next)
}