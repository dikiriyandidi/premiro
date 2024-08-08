'use strict'
let op = Sequelize.Op;
/**

 * GET voucher DATATABLE
 */
exports.voucherDatatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT id , name , type , type_value , start_date , end_date , quota , custom_code , general_code, status from voucher where status not like 'Trash') as SRC",
        'id',
        ['id', 'name', 'type', 'type_value', 'start_date', 'end_date', 'quota', 'custom_code', 'general_code', 'status'],
        req.input.post
    )
    return data
}

/**

 * SAVE voucher TO DATABASE
 */
exports.insertVoucher = (db, post) => new Promise((resolve, reject) => {
    let values = {
        name: post.name,
        type: post.type,
        type_value: post.type_value,
        quota: post.quota,
        custom_code: post.custom_code,
        general_code: post.general_code,
        start_date: post.start_date,
        end_date: post.end_date,
        status: post.status,
    }

    db.model('voucher').create(values).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**
 * UPDATE voucher STATUS TO TRASH
 */
exports.voucherDestroy = (db, id) => new Promise((resolve, reject) => {
    db.model('voucher').update({
        status: 'Trash'
    }, {
        where: {
            id: id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**

 * GET voucher DETAIL DATATABLE
 */
exports.voucherDetailDatatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT a.id , b.name as voucher_name , a.voucher_code , a.used_date , a.used_by from voucher_detail a LEFT JOIN voucher b ON b.id = a.voucher_id where a.voucher_id = " + req.body.id + ") as SRC",
        'id',
        ['id', 'voucher_name', 'voucher_code', 'used_date', 'used_by'],
        req.input.post
    )
    return data
}

/**

 * SAVE voucher DETAIL TO DATABASE
 */
exports.insertVoucherDetail = (db, post) => new Promise((resolve, reject) => {
    let values = {
        voucher_id : post.voucher_id,
        voucher_code : post.voucher_code
    }

    db.model('voucher_detail').create(values).then((data) => {
        resolve(data)
    }).catch(reject)
})


/**

 * GET voucher DETAIL BY voucher ID
 */
exports.getVoucherDetailCount = (db, voucher_id) => new Promise((resolve, reject) => {

    db.model('voucher_detail').findOne({
        where: {
            voucher_id: voucher_id,
            used_date : {
                [op.ne] : null,
            }
        },
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('voucher_id')), 'count_vouc']],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})