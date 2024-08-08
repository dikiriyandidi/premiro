/**
 * Example DB Connection String using .env
 */
'use strict'
const path = require('path')
const fs = require('fs')

global.Sequelize = require('sequelize')

const rootpath = path.resolve(__dirname, '../../../')
const basepath = 'apps/v1'
const libErrorHandler = require("../libs/error_handler")

exports.getConfig = (async () => {

    let env = process.env.NODE_ENV
    let cfg = require('../config/' + env + '/config')

    let db = new Sequelize(process.env.DB_NAME, process.env.DB_W_USERNAME, process.env.DB_W_PASSWORD,
        {
            host: process.env.DB_W_HOST,
            dialect: process.env.DB_DIALECT,
            logging: process.env.DB_LOG === "true" ? console.log : false,
            benchmark: false,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            port: process.env.DB_W_PORT || 3306,
            timezone: '+07:00'
        }
    )

    let config = {
        db: db,
        config: cfg
    }

    return config
})

exports.getConfigSync = () => {
    let env = process.env.NODE_ENV
    let cfg = require('../config/' + env + '/config')

    let db = new Sequelize(process.env.DB_NAME, process.env.DB_W_USERNAME, process.env.DB_W_PASSWORD,
        {
            host: process.env.DB_W_HOST,
            dialect: process.env.DB_DIALECT,
            logging: process.env.DB_LOG === "true" ? console.log : false,
            benchmark: false,
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            port: process.env.DB_W_PORT || 3306,
            timezone: '+07:00'
        }
    )

    let config = {
        db: db,
        config: cfg
    }

    return config
}

exports.coreLib = (libName) => {
    if(fs.existsSync(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'))
        return require(path.normalize(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'))
    else
        return require(path.normalize(rootpath + '/core/libs/' + libName.toLowerCase() + '.js'))
}

exports.coreQueries = (libName) => require(path.normalize(rootpath + '/' + basepath + '/queries/' + libName.toLowerCase() + '.js'))

exports.coreDb = ()=>{
    let dbCorePath = '../../../core/dbcore/index'
    return require(dbCorePath)(rootpath, basepath)
}

exports.coreFilelogger = ()=>{
    let fileLogger = require('../../../core/filelogger')
    return fileLogger
}

exports.coreMyError = ()=>{
    let myLogger = require('../../../core/libs/error')
    return myLogger
}

exports.coreMyLogger = ()=>{
    let myLogger = require('../../../core/logger')
    return myLogger
}

exports.loadEnv = ()=>{
    const dotEnv = require('dotenv')
    let pathEnv = rootpath+'/.env'
    dotEnv.config({path:pathEnv})
}

exports.init = (option={})=>{
    let {
        load_env:paramLoadEnv=false
    } = option
    
    if(paramLoadEnv) this.loadEnv()
    let { config } = this.getConfigSync()

    global.myConfig = config
    global.ENV = process.env.NODE_ENV
    global.myLogger = this.coreMyLogger()
    global.MyError = this.coreMyError()
    global.fileLogger = this.coreFilelogger()
    let db = this.coreDb()

    return {
        db:db,
        lib:this.coreLib,
        queries:this.coreQueries,
    }
}

// next function imitate express next
// only use as a middleware and take benefit from famility adoption
exports.next = (error)=>{
    console.log(error)
    if(global._initLogHandler){
        info(error.message,'error')
    }

    // uncomment function if you want to log cron result in service.log
    // libErrorHandler.main(error)
}

exports.logHandler = (fileLoggerName,inform=true)=>{
    let errorFilename = `customs/${fileLoggerName}.log`
    let loggerOption = {
        is_append_only:true,
        action:`action-${fileLoggerName}`
    }
    
    if(!global.fileLogger){
        throw 'initialize error handler after init'
    } 

    global.e = (message,typeLogger="error")=>{ fileLogger[typeLogger](errorFilename,message,loggerOption)  }
    global.info = (message,typeLogger="info")=>{
        console.log(message)
        fileLogger[typeLogger](errorFilename,message,loggerOption) 
    }
    global.log = global.info
    if(global._initLogHandler == undefined) global._initLogHandler = true

    if(inform){
        console.log(`** Set false second params logHandler to turn off this message`)
        console.log(`** Use global info and log for logging.`)
        // console.log(`** piew piew piew **`)
    }
    console.log(`** Cron log stored in ${errorFilename}`)
}

exports.cliArguments = (filters)=>{
    let {
        original:argumentOriginal
    } = JSON.parse(process.env.npm_config_argv)
    if(filters.length){
        return this.lookupArguments(filters,argumentOriginal)
    }
    return argumentOriginal
}

exports.lookupArguments = (filters=[],originalArguments)=>{
    let lookup = {}
    if(filters.length){
        originalArguments.filter(stringParams=>{
            let matched = filters.some(keyArg=>{
                let regex = new RegExp(keyArg,'g')
                let isMatch = stringParams.match(regex)
                if(isMatch){
                    let params = stringParams.split("=")
                    let key = (params[0]) ? params[0] : keyArg
                    key = key.replace(/\--/g,"")
                    lookup[key] = (params[1]) ? params[1] : false
                }
                return isMatch
            })
            return matched
        })
    }
    return lookup
}