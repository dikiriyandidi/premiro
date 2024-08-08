const WebLog = require("./web_log")

exports.memoryUsage = (process,req)=>{
  return process.memoryUsage().heapUsed - req.memory_used
}

exports.elapseTime = (req,currentDate=new Date)=>{
  return (((currentDate.getTime() - req.start_process)*100/1000)/100).format(2,3)
}

exports.envAppWebLog = ()=>{
  return [1,'1',true,'true'].includes(process.env.APP_WEBLOG)
}

// main function to write the log
exports.writeLog = (req,appendAttribute={})=>{
  let {
    status_code=404,
    memory_usage=-1, 
  } = appendAttribute
  let isWriteLog = this.envAppWebLog()
  if(isWriteLog==false) return false

  return new WebLog(req,{
    status_code,
    memory_usage,
    app_logger:{
        myLogger,fileLogger
    }
  })
}

// hooks function to append custom logic for response render
exports.wlRender = (req,res,option)=>{
  let {
    status_code=404
  } = (option) ? option : {}

  let appendAttribute = {
    status_code,
    memory_usage:this.memoryUsage(process,req)
  }

  return this.writeLog(req,appendAttribute)
}

// hooks function to append custom logic for response success
exports.wlSuccess = (req,res,option)=>{
  let {
    status_code=404
  } = (option) ? option : {}

  let appendAttribute = {
    status_code,
    memory_usage:this.memoryUsage(process,req)
  }
  
  return this.writeLog(req,appendAttribute)
}

// hooks function to append custom logic for response raw
exports.wlRaw = (req,res,option)=>{
  let {
    status_code=404
  } = (option) ? option : {}

  let appendAttribute = {
    status_code,
    memory_usage:this.memoryUsage(process,req)
  }
  
  return this.writeLog(req,appendAttribute)
}

// hooks function to append custom logic for response error
exports.wlError = (req,res,option={})=>{
  let {
    status_code=404
  } = (option) ? option : {}

  let appendAttribute = {
    status_code,
    memory_usage:this.memoryUsage(process,req)
  }
  
  return this.writeLog(req,appendAttribute)
}

// hooks function to append custom logic for response not found
exports.wlNotFound = (req,res,option)=>{
  let {
    status_code=404
  } = (option) ? option : {}

  let appendAttribute = {
    status_code,
    memory_usage:this.memoryUsage(process,req)
  }
  
  return this.writeLog(req,appendAttribute)
}