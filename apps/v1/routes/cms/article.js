'use strict';

module.exports = (app, router) => {
    const ctr = app.controller('cms/article')

    router.get('/', ctr.view)
    router.post('/', ctr.datatable)
    router.get('/new', ctr.form)
    router.get('/detail/:id', ctr.form)
    router.post('/manage', ctr.manage)
    router.delete('/destroy/:id', ctr.destroy)
    router.post('/export', ctr.export)
}