'use strict';

module.exports = (app, router) => {
    const event = app.controller('cms/event')

    router.get('/event_list', event.eventView)
    router.post('/event_list', event.eventDatatable)
    router.post('/event_list/manage', event.eventManage)
    router.get('/event_list/new', event.form)
    router.get('/event_list/detail/:id', event.form)
    router.delete('/event_list/destroy/:id', event.eventDestroy)

    router.get('/city_list', event.cityView)
    router.post('/city_list', event.cityDatatable)
    router.post('/city_list/manage', event.cityManage)
    router.delete('/city_list/destroy/:id', event.cityDestroy)
}