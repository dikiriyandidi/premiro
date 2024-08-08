'use strict';

module.exports = (rootpath, basepath) => {

    const DB = require('./db.js')(rootpath, basepath);

    global.Sequelize = require('sequelize');
    global.db = new DB;
    
    let log = false
    if(process.env.DB_LOG == "true")
        log = console.log
    db.addConnection('default', {
        is_replication: process.env.IS_REPLICATION,
        read: {
            host: process.env.DB_R_HOST,
            user: process.env.DB_R_USERNAME,
            password: process.env.DB_R_PASSWORD,
            port : process.env.DB_R_PORT || 3306
        },
        write: {
            host: process.env.DB_W_HOST,
            user: process.env.DB_W_USERNAME,
            password: process.env.DB_W_PASSWORD,
            port : process.env.DB_W_PORT || 3306
        },
        database: process.env.DB_NAME,
        log: log,
        dialect: process.env.DB_DIALECT,
        timezone: process.env.TZ || '+07:00'
    }, true);
    
    return db.connection();
}