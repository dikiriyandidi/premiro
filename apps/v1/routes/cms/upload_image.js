'use strict';

module.exports = (app, router) => {
    const ctr = app.controller('cms/upload_image')

    router.get('/', ctr.uploadImage)
    router.post('/', ctr.datatableImage)
    router.post('/manage_image', ctr.manageImage)
}