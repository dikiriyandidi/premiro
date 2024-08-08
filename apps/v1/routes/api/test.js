'use strict'

module.exports = (app, router) => {
    const ctrl = app.controller('api/log')

    router.get('/', ctrl.index)
}