'use strict'

module.exports = (app, router) => {
    const ctrl = app.controller('api/testing_base64')
    router.post('/upload_cs', ctrl.uploadCloudStorage)
}