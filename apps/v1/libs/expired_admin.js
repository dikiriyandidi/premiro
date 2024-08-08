/**
 * Example Cron Using DB Connection String from .env
 */
'use strict'

const timehelper = require('./timehelper')
// const q_cronjob = require('../queries/cronjob')


let prepareConnection = (db) => {
    // - get db connection
    db.getConnection = () => {
        return db
    }

    // - load model
    require('../models/admin')(db)
    // require('../models/admin_expired_log')(db)
}

module.exports.process = (async (db) => {
    // - prepare connection
    prepareConnection(db)

    console.log('Connection Success')

    // let date = timehelper.generateDatetime(new Date())
    // let current_date = timehelper.generateCustomDate(null, 'YYYY-MM-DD')

    // let admin = await q_cronjob.getExpiredAdmin(db, current_date)
    // if (admin.length > 0) {
    //     console.log(`Triggered at ${date}`)
    //     for (let i in admin) {
    //         await q_cronjob.deleteAdmin(db, admin[i].id)
    //         console.log (admin[i].fullname +" has Expired")
    //         // await q_cronjob.createExpiredLog(db, admin[i], current_date)
    //     }

    //     console.log("DONE")
    // } else {
    //     console.log('There are no data to be processed.')
    // }
    
})

