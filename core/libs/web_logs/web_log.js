
class WebLog {
  constructor(expressReq,option={}){
    let {
      app_logger:appLogger=false,
      status_code:responseStatusCode=0
    } = option

    let isExclude = this.excludePath(expressReq.path)
    if(isExclude) return false
    
    this.prepData(expressReq,option)
    let otherData = this.prepOtherData(expressReq,option)
    let logMessage = this._format()
    let otherMessage = this._otherMessage(otherData)
    logMessage = this.showFormat([logMessage,otherMessage])
    
    let hasWarned = this._warnAppLoger(appLogger)
    if(hasWarned==false){
      this.log(responseStatusCode,logMessage,appLogger)
      return logMessage
    }
    return logMessage
  }
  excludePath(path){
    let isMatch = path.match(/favicon.ico/)
    return (isMatch) ? true : false
  }
  prepData(req,option){
    let {
      status_code:statusCode=0,
      memory_usage:memoryUsage=0
    } = (option) ? option : {}

    this.ip = this._getIpFromHeaderOrSockeAddress(req)
    this.date = new Date().toISOString()
    this.requestMethod = this._getRequestMethod(req)
    this.path = this._getRequestPath(req)
    this.httpProtocol = this._getHttpVersion(req)
    this.httpResponseStatusCode = statusCode
    this.totalBytes = memoryUsage
    this.clientAgent = this._getClientAgent(req)
  }
  _getIpFromHeaderOrSockeAddress(req){
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress
  }
  _getRequestMethod(req){
    return req.method
  }
  _getRequestPath(req){
    return req.path
  }
  _getHttpVersion(req){
    return `HTTP/${req.httpVersion}`
  }
  _getClientAgent(req){
    return req.headers['user-agent']
  }
  _format(){
    // %{IPV4:ip} - - \[%{TIMESTAMP_ISO8601:time_utc}\] "%{WORD:req_method} %{PATH:req_path} HTTP/1.1" %{INT:response} %{NUMBER:bytes} "-" "%{DATA:agent}”
    return `${this.ip} - - [${this.date}] "${this.requestMethod} ${this.path} ${this.httpProtocol}" ${this.httpResponseStatusCode} ${this.totalBytes} "-" "${this.clientAgent}"`
  }
  prepOtherData(req,option={}){
    return {
      host:req.headers.host,
      referer:req.headers.referrer || req.headers.referer
    }
  }
  _otherMessage(other={}){
    let {
      host:serverHost="",
      referer:requestReferer=""
    } = other

    let array = [
      (serverHost) ? `[server ${serverHost}]` : serverHost,
      requestReferer
    ].filter(row=>row)
    return (array.length) ? `- ${array.join(" ")}` : ""
  }
  showFormat(array){
    return array.filter(row=>row).join(" ")
  }
  _warnAppLoger(logger){
    let {
      myLogger=false,
      fileLogger=false
    } = (logger) ? logger : {}

    let countWarn = 0
    if(!myLogger){
      console.warn('web log depends on apps mylogger');
      countWarn++;
    } 
    if(!fileLogger){
      console.warn('web log depends on apps fileLogger');
      countWarn++;
    } 
    return (countWarn) ? true : false
  }
  log(statusCode,message,logger={}){
    let {
      myLogger,
      fileLogger
    } = logger
    let method = this._logMethod(statusCode)
    
    // myLogger[method]('web_logs',message)
    fileLogger[method]('customs/web_logs.log',message,{
      action:"web_logs",
      is_append_only:true
    })
  }
  _logMethod(){
    return (200) ? "info" : "error"
  }
}

module.exports = WebLog;