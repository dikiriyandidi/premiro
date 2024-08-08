'use strict'

// 
exports.main = (error)=>{
  try {
    let {
      option:errorOption
    } = error

    this._validateGlobalHandler()
    this._coreErrorHandler(error)
    if(errorOption.logger) this.fileLoggerHandler(error)

  } catch (error) {
    console.log(error)
    throw error
  }
}

exports._validateGlobalHandler = ()=>{
  if(!global.myLogger) console.warn('global mylogger n/a')
  if(!global.fileLogger) console.warn('global fileLogger n/a')
}

// simulate error handler on core/index.js line 69 error handler
// core error handler append message to service.log
exports._coreErrorHandler = (err)=>{
  global.myLogger.error(err)
  if(!err.http_status_code) {
    err.http_status_code = 500
  }

  return err
}

exports.fileLoggerHandler = (error = {})=>{
  let {
    message:errorMessage="",
    option:errorOption={}
  } = error

  let storedError = {...error}
  delete storedError.option

  let {
    logger:fileName,
    logger_option:loggerOption={}
  } = errorOption
  global.fileLogger.error(`customs/${fileName}`,storedError,loggerOption)

  return error
}