'use strict'

const cron_lib = require('../libs/expired_admin')
const cron_config = require('../libs/cron_config')

let runProcess = () => {
    (async () => {
        // - get cron config
        let config = await cron_config.getConfig()
        
        // - process data
        cron_lib.process(config.db)
    })().catch((err) => {
        console.log(err)
    })
}

runProcess()

