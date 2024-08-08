'use strict'

/**
 
 * GET ALL EVENT CITY
 */
exports.getAllEventCity = (db) => new Promise((resolve, reject) => {
    db.model('event_city').findAll({
        order: [
            ['city_name', 'ASC']
        ]
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**
 
 * GET PUBLISH EVENT CITY
 */
exports.getPublishEventCity = (db) => new Promise((resolve, reject) => {
    db.model('event_city').findAll({
        where: {
            status: 'Published'
        },
        order: [
            ['city_name', 'ASC']
        ]
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})