'use strict'

module.exports = (app, router) => {
    const ctrl = app.controller('api/test')

    router.get('/', ctrl.get)
    router.post('/post', ctrl.post)
}