'use strict'

module.exports = (app, router) => {
    const ctrl = app.controller('api/event')
    router.get('/', ctrl.list)
    router.get('/detail/:id', ctrl.detail)
    router.post('/create', ctrl.create)
    router.put('/update/:id', ctrl.update)
    router.delete('/destroy/:id', ctrl.destroy)

    router.get('/city/', ctrl.listCity)
    router.get('/city/detail/:id', ctrl.detailCity)
    router.post('/city/create', ctrl.createCity)
    router.put('/city/update/:id', ctrl.updateCity)
    router.delete('/city/destroy/:id', ctrl.destroyCity)

}