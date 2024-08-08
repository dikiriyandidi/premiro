'use strict';

module.exports = (app, router) => {
    const controller = app.controller('web/index')
    router.get('/', controller.landingPage)
    router.get('/weekend', controller.weekend)
};