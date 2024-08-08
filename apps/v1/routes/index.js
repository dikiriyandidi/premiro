'use strict'

module.exports = (app, router) => {
    const MainController = app.controller('index')
    // router.use('/newroutes', app.route('newroutes'))
    //get, => allow get request
    //post, => allow post request
    //all, =>allow all (get,post,option) request
    //use => re-route
    // router.all('/', MainController.index)
    router.use('/cms', app.route("cms"))
    router.use('/api', app.route('api'))
    router.use('/', app.route("web"))
}