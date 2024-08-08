'use strict'

module.exports = (app, router) => {
    const tokenController = app.controller('api/token')
    router.all('/get', tokenController.get)
    router.post('/check', tokenController.check)
    router.post('/refresh', tokenController.refresh)
}