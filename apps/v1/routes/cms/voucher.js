'use strict';

module.exports = (app, router) => {
    const ctr = app.controller('cms/voucher')

    router.get('/', ctr.voucherView)
    router.post('/', ctr.datatableVoucher)

    router.get('/create', ctr.formVoucherView)
    router.post('/create', ctr.insertVoucher)

    router.post('/destroy', ctr.voucherDestroy)

    router.get('/detail/:id', ctr.voucherDetailView)
    router.post('/detail', ctr.datatableVoucherDetail)
}