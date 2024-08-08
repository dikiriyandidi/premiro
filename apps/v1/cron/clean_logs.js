'use strict'

global.Sequelize = require('sequelize')

const _filehelper = require('../libs/file_helper')
const _timehelper = require('../libs/timehelper')
const _qtoken = require('../queries/token')

const currentTime = new Date()

const { getConfigSync } = require('../libs/cron_config')
const { db, config } = getConfigSync()
db.getConnection = () => db

require('../models/token_log')(db)

const runProcess = () => {
    // console.log(config)

    deleteLogFile()
    deleteTokenLog()
}

const deleteLogFile = () => {
    try {
        _filehelper
            .getFilesRecursively(config.log_path, config.log_exceptions)
            .filter(file => {
                // console.log(file)

                let { mtime } = _filehelper.getFileInfo(file)
                // console.log(mtime)

                let { date: diffDate } = _timehelper.diffDate(mtime, currentTime)
                // console.log(diffDate)

                return diffDate > config.log_backdate
            })
            .forEach(file => _filehelper.removeFile(file))
    } catch (error) {
        // console.log(error)
        console.log('Something went wrong in delete log file!')
    }
}

const deleteTokenLog = async () => {
    try {
        let backdate = _timehelper.subtractDay(currentTime, config.log_backdate)
        // console.log(backdate)

        _qtoken.deleteTokenLogBeforeBackDate(db, backdate)
    } catch (error) {
        // console.log(error)
        console.log('Something went wrong in delete token log!')
    }
}

runProcess()