'use strict';

module.exports = (app, router) => {
    router.use('/token', app.route("token",'api'))
    router.use('/event', app.route("event", 'api'))
    router.use('/test', app.route("test", 'api'))
    router.use('/testing_base64', app.route("testing_base64", 'api'))
    router.use('/log', app.route('log', 'api'))
}