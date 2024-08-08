'use strict'

/**
 * RENDER voucher LIST PAGE
 * - render to view
 */
exports.voucherView = (req, res, next) => {
    (async () => {
        // - render to views
        res.render('voucher', {

        })
    })().catch(next)
}

/**

 * DATATABLE voucher LIST
 */
exports.datatableVoucher = (req, res, next) => {
    (async () => {
        let data = await req.queries('voucher').voucherDatatable(req.db, req)

        if (data != null) {
            for (let i in data.data) {
                let child = await req.queries('voucher').getVoucherDetailCount(req.db, data.data[i].id)

                data.data[i].quota = child.dataValues.count_vouc+"/"+data.data[i].quota
                data.data[i].start_date = req.lib("timehelper").formatYmdHis(data.data[i].start_date)
                data.data[i].end_date = req.lib("timehelper").formatYmdHis(data.data[i].end_date)
            }


            res.json(data)
        } else {
            res.error("Data not found",200)
        }
    })().catch(next)
}

/**
 * RENDER voucher CREATE FORM PAGE
 * - render to view
 */
exports.formVoucherView = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            add:[{url:"/cms/voucher/create"}],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        // - render to views
        res.render('voucher_form', {

        })
    })().catch(next)
}

/**
 * MANAGE INSERT voucher DATA
 * - insert voucher data to db
 */
exports.insertVoucher = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            add:[{url:"/cms/voucher/create"}],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }
        // - validate request data value
        let param = [{
                name: 'name',
                rules: [
                    'required'
                ]
            },
            {
                name: 'type',
                rules: [
                    'required'
                ]
            },
            {
                name: 'type_value',
                rules: [
                    'required','numeric'
                ]
            }, {
                name: 'quota',
                rules: [
                    'required','numeric'
                ],
            },
            {
                name: 'custom_code',
                rules: [
                    'required'
                ],
            },
            {
                name: 'start_date',
                rules: [
                    'required'
                ],
            },
            {
                name: 'end_date',
                rules: [
                    'required'
                ],
            },
            {
                name: 'status',
                rules: [
                    'required'
                ]
            },
        ]
        req.validate(req, param)


        let data = await req.queries("voucher").insertVoucher(req.db, req.body);
        let voucher_id = data.id

        if (req.body.custom_code == "Yes") {
            console.log(parseInt(req.body.quota))
            for (let i = 0; i < parseInt(req.body.quota); i++) {
                let code = await req.lib("voucher_format_generator").generateVoucher()

                let data = {
                    voucher_id : voucher_id,
                    voucher_code : code
                }

                await req.queries("voucher").insertVoucherDetail(req.db, data);
            }
        }

        let message = 'Success insert data'
        res.success({
            message: message
        })

    })().catch(next)
}

/**

 * DESTROY voucher
 * - validate request data value
 * - save to database
 */
exports.voucherDestroy = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            delete:[{url:"/cms/voucher/destroy"}],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        // - validate request data value
        let param = [{
            name: 'id',
            rules: [
                'required'
            ]
        }]
        req.validate(req, param)

        // - save to database
        req.queries('voucher').voucherDestroy(req.db, req.body.id)

        res.success({
            message: 'Success delete data'
        })
    })().catch(next)
}

/**
 * RENDER voucher DETAIL PAGE
 * - render to view
 */
exports.voucherDetailView = (req, res, next) => {
    (async () => {
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            view:[{url:"/cms/voucher/detail"}],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }
        // - render to views
        res.render('voucher_detail', {
            id: req.params.id,
        })
    })().catch(next)
}

/**

 * DATATABLE voucher DETAIL
 */
exports.datatableVoucherDetail = (req, res, next) => {
    (async () => {
        let data = await req.queries('voucher').voucherDetailDatatable(req.db, req)

        if (data != null) {
            for (let i in data.data) {
                data.data[i].start_date = req.lib("timehelper").formatYmdHis(data.data[i].start_date)
                data.data[i].end_date = req.lib("timehelper").formatYmdHis(data.data[i].end_date)
            }


            res.json(data)
        } else {
            res.error("Data not found",200)
        }
    })().catch(next)
}