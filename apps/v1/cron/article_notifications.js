global.Sequelize            = require('sequelize')
global.sequelize            = require('sequelize')
let article_libs = require('../libs/article_libs')

let insertNotification = (req, res, next) => {
    (async() => {
        let data = await article_libs.insert_notification();
        return;
    })()

}
insertNotification();