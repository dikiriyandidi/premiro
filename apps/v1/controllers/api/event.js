'use strict'

/** Event */
exports.list = (req, res, next) => {
    (async () => {
        let limit = req.input.get.limit || 2;
        let offset = req.input.get.offset || 0;
        limit = parseInt(limit)
        offset = parseInt(offset)
        let data = await req.queries('event').getEvent(req.db, limit, offset);
        for(let i in data.event){
            data.event[i].dataValues.startdate = req.lib("timehelper").format_ymd_custom(data.event[i].startdate)
            data.event[i].dataValues.enddate = req.lib("timehelper").format_ymd_custom(data.event[i].enddate)
            data.event[i].dataValues.publish_date = req.lib("timehelper").format_ymd_his(data.event[i].publish_date)
        }
        res.success({
            total: data.total,
            event: data.event,
            limit,
            offset
        });
    })().catch(next);
}

exports.detail = (req, res, next) => {
    (async() =>{
        
        let id = req.params.id;

        // - validate request data value
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required',200);
            return
        }
        
        let data = await req.queries('event').eventDetail(req.db, id);
        if(data == null){
            res.error("Data event invalid",200);
        }else{

            data.dataValues.startdate = req.lib("timehelper").format_ymd_custom(data.startdate)
            data.dataValues.enddate = req.lib("timehelper").format_ymd_custom(data.enddate)
            data.dataValues.createdate = req.lib("timehelper").format_ymd_his(data.createdate)
            data.dataValues.updatedate = req.lib("timehelper").format_ymd_his(data.updatedate)
            data.dataValues.publish_date = req.lib("timehelper").format_ymd_his(data.publish_date)

            res.success(data);
        }
    })().catch(next);
}

exports.create = (req, res, next) => {
    (async () => {
        // let token = req.headers[myConfig.header_key]
        // let token_data = await req.queries('token').check(req.db, token, req.ip, myConfig.token_match_ip)

        // if(!token_data.token_profile.admin_id) {
        //     return res.error('Insufficient privilege', 403)
        // }

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
            },
            {
                name: 'venue',
                rules: [
                    'required'
                ]
            }
        ]
        req.validate(req, param)

        let start_date_format = req.body.startdate + " " + '00:00:00'
        let end_date_format = req.body.enddate + " " + '23:59:59'
        let difference = req.lib("timehelper").diff_date(start_date_format, end_date_format)

        if (difference.date < 0 || difference.hour < 0 || difference.minute < 0) {
            res.error('End date cannot be greater than start date',200)
            return
        }

        // - get string value
        if (req.body.id == null || req.body.id == '') {
            req.body.string_id = await req.lib('build_string_id').createStringId(req.db,req.body.title, 'event')
        }

        // - save to database
        req.queries('event').eventManage(req.db, req.body)

        return res.success({
            message: 'Event created'
        })

    })().catch(next)
}

exports.update = (req, res, next) => {
    (async () => {
        
        // let token = req.headers[myConfig.header_key]
        // let token_data = await req.queries('token').check(req.db, token, req.ip, myConfig.token_match_ip)

        // if(!token_data.token_profile.admin_id) {
        //     return res.error('Insufficient privilege', 403)
        // }

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
        },
        {
            name: 'venue',
            rules: [
                'required'
            ]
        }]

        // - validate request data value
        req.validate(req, param)
        
        let id = req.params.id;
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required',200);
            return
        }

        let start_date_format = req.body.startdate + " " + '00:00:00'
        let end_date_format = req.body.enddate + " " + '23:59:59'
        let difference = req.lib("timehelper").diff_date(start_date_format, end_date_format)

        if (difference.date < 0 || difference.hour < 0 || difference.minute < 0) {
            res.error('End date cannot be greater than start date',200)
            return
        }

        // - get string value
        if ( id == null || id == '') {
            req.body.string_id = await req.lib('build_string_id').createStringId(req.db,req.body.title, 'event')
        }else{
            req.body.id = id
        }

        // - save to database
        req.queries('event').eventManage(req.db, req.body)

        return res.success({
            message: 'Event updated'
        })

    })().catch(next)
}

exports.destroy = (req, res, next) => {
    (async () => {
        
        let id = req.params.id;

        // - validate request data value
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required',200);
            return
        }

        let data = await req.queries('event').eventDetail(req.db, id);
        if(data == null){
            res.error('Data event invalid',200)
            return
        }

        // - save to database
        req.queries('event').destroy(req.db, id)

        res.success({
            message: 'Event Deleted'
        })

    })().catch(next)
}

/**
 *  
 * Event City
 *  
 **/
exports.listCity = (req, res, next) => {
    (async () => {
        let limit = req.input.get.limit || 2;
        let offset = req.input.get.offset || 0;
        limit = parseInt(limit)
        offset = parseInt(offset)
        let data = await req.queries('event').getCity(req.db, limit, offset);
        res.success({
            total: data.total,
            city: data.city,
            limit,
            offset
        });
    })().catch(next);
}

exports.detailCity = (req, res, next) => {
    (async() =>{
        
        let id = req.params.id;

        // - validate request data value
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required',200);
            return
        }
        
        let data = await req.queries('event').cityDetail(req.db, id);
        if(data == null){
            res.error('Data city invalid',200)
            return
        }else{
            res.success(data)
        }
    })().catch(next);
}

exports.createCity = (req, res, next) => {
    (async () => {
        // let token = req.headers[myConfig.header_key]
        // let token_data = await req.queries('token').check(req.db, token, req.ip, myConfig.token_match_ip)

        // if(!token_data.token_profile.admin_id) {
        //     return res.error('Insufficient privilege', 403)
        // }

        // - validate request data value
        let param = [{
            name: 'city_name',
            rules: [
                'required'
            ],
            message: 'Field city name is required.'
        }, {
            name: 'description',
            rules: [
                'required'
            ],
            message: 'Field description is required.'
        }]
        req.validate(req, param)

        await req.queries('event').eventCityManage(req.db, req.body)

        return res.success({
            message: 'City created'
        })

    })().catch(next)
}

exports.updateCity = (req, res, next) => {
    (async () => {
        
        // let token = req.headers[myConfig.header_key]
        // let token_data = await req.queries('token').check(req.db, token, req.ip, myConfig.token_match_ip)

        // if(!token_data.token_profile.admin_id) {
        //     return res.error('Insufficient privilege', 403)
        // }

        let param = [{
            name: 'city_name',
            rules: [
                'required'
            ],
            message: 'Field city name is required.'
        }, {
            name: 'description',
            rules: [
                'required'
            ],
            message: 'Field description is required.'
        }]

        // - validate request data value
        req.validate(req, param)
        
        let id = req.params.id;
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required',200);
            return
        }else{
            req.body.id = id
        }

        await req.queries('event').eventCityManage(req.db, req.body)

        return res.success({
            message: 'City updated'
        })

    })().catch(next)
}

exports.destroyCity = (req, res, next) => {
    (async () => {
        
        let id = req.params.id;

        // - validate request data value
        if (id == undefined || id == '' || id == null) {
            res.error('ID is required',200);
            return
        }

        let data = await req.queries('event').cityDetail(req.db, id);
        if(data == null){
            res.error('Data city invalid',200)
            return
        }

        // - save to database
        req.queries('event').eventCityDestroy(req.db, id)

        res.success({
            message: 'City deleted'
        })

    })().catch(next)
}