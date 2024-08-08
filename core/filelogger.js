'use strict';

let Log4js = require('log4js')
let configFileLogger = {
    appenders:{
        filestarter:{
            type:"file",
            filename:"logs/customs/filelogger.log",
            maxLogSize:102400000,
            backups:50,
            category:`file${process.env.NAMESPACE}`
        }
    },
    categories:{
        filestarter:{appenders:["filestarter"],level:"ALL"}
    }
}
let _defaultFileAppender= {...configFileLogger.appenders.filestarter}

let fileLogger = {}
fileLogger.trace = (action, message,option={}) => {
    fileLogger.push('trace', {action:action,message:message,option:option});
};

fileLogger.debug = (action, message,option={}) => {
    fileLogger.push('debug', {action:action,message:message,option:option});
};

fileLogger.info = (action, message,option={}) => {
    fileLogger.push('info', {action:action,message:message,option:option});
};

fileLogger.warn = (action, message,option={}) => {
    fileLogger.push('warn', {action:action,message:message,option:option});
};

fileLogger.error = (action, message,option={}) => {
    fileLogger.push('error', {action:action,message:message,option:option});
};

fileLogger.fatal = (action, message,option={}) => {
    fileLogger.push('fatal', {action:action,message:message,option:option});
};

fileLogger.push = (type, params) => {
    let {action,message,option} = params;
    let actionIsFilename = (typeof action == "string" && action.match(/\.log/g) ) ? true : false
    let hasCategory = (option.category) ? true : false
    option = (typeof option =="string") ? {action:option} : {...option}
    let hasAction = (option.action) ? true : false
    let isAppendOnly = (option.is_append_only) ? option.is_append_only : false

    // generate category based on filename, if action is filename.log
    if(actionIsFilename===true){
        let filenameAsCategory = fileLogger.generateCategory(action)
        let filepath = (action.match(/logs\//)==null) ? `logs/${action}` : action;
        let newConfig = {appenders:{},categories:{}};
            newConfig.appenders[filenameAsCategory] = {..._defaultFileAppender,filename:filepath,category:filenameAsCategory}
            newConfig.categories[filenameAsCategory] = {appenders:[filenameAsCategory],level:"ALL"}
        fileLogger.setupLogger(newConfig)
        action = fileLogger.getAppenderCategory(filepath)        
        option.category = action
        hasCategory= true
        if(hasAction){
            action = option.action
        }
    }

    // // merging myLogger with fileLogger so myLogger could be using after fileLogger called
    let configFileLogger = fileLogger.mergeConfig(myLogger.logconfig)
    Log4js.configure(configFileLogger);
    
    let newMessage = {"message":message};
    let isObjectMessage = false;
    if(typeof message === 'object') {
        isObjectMessage = true;
        newMessage = JSON.stringify(message);
    }
    
    let newData = {"action": action, "data": newMessage};
    if(isAppendOnly){
        newData = (isObjectMessage) ? newMessage : message
    }
    
    let activeLogger = Log4js.getLogger(`file${process.env.NAMESPACE}`)
    if(hasCategory){
        activeLogger = Log4js.getLogger(option.category)
    }

    if(type == 'trace') {
        activeLogger.trace(newData);
    }else if(type == 'debug') {
        activeLogger.debug(newData);
    }else if(type == 'info') {
        activeLogger.info(newData);
    }else if(type == 'warn') {
        activeLogger.warn(newData);
    }else if(type == 'error') {
        activeLogger.error(newData);
    }else if(type == 'fatal') {
        activeLogger.fatal(newData);
    }
};

fileLogger.mergeConfig = (otherConfig)=>{
    let currentAppender = {}
    let currentCategories = {}

    if(otherConfig.appenders)
        currentAppender = fileLogger._mergeObject(configFileLogger.appenders,otherConfig.appenders)
    if(otherConfig.categories)
        currentCategories = fileLogger._mergeObject(configFileLogger.categories,otherConfig.categories)
    return {appenders:currentAppender,categories:currentCategories}
}

fileLogger._mergeObject= function(){
    let args = arguments
    let mainObject = {...args[0]}
    if(args.length>1){
        for(let i=1;i<args.length;i++){
            let crParam = args[i]
            Object.keys(crParam).map((obKey,i)=>{
                mainObject[obKey] = crParam[obKey]
            })
        }
    }
    return mainObject
}

fileLogger.generateCategory = (filename)=>{
    let categoryName = filename.substring(filename.lastIndexOf('/')+1).replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'')
    return categoryName
}

fileLogger.setupLogger=(newAppender={})=>{
    let availableAppender = configFileLogger.appenders
    let fileCollection = Object.keys(availableAppender).map((obKey,i)=>{
        return availableAppender[obKey].filename
    })

    Object.keys(newAppender.appenders).map((obKey,i)=>{
        let fileName = newAppender.appenders[obKey].filename
        let indexFile = fileCollection.indexOf(fileName)
        if(indexFile==-1)
            if(newAppender.appenders[obKey])
                availableAppender[obKey] = newAppender.appenders[obKey]
            if(newAppender.categories[obKey])
                configFileLogger.categories[obKey] = newAppender.categories[obKey]
    })

    return true
}

fileLogger.getAppenderCategory = (fileName)=>{
    let appender = fileLogger.getAppender(fileName)
    if(appender){
        return (appender.category) ? appender.category : false
    }
    return false
}

fileLogger.getAppender = (fileName)=>{
    let availableAppender = configFileLogger.appenders;
    let fileCategory = []
    let fileCollection = Object.keys(availableAppender).map((obKey,i)=>{
        let crAppender = availableAppender[obKey]
        fileCategory[crAppender.filename] = crAppender.category
        return crAppender.filename
    })

    let indexFile = fileCollection.indexOf(fileName)
    if(indexFile==-1){
        return false
    }
    let indexCategory = fileCategory[fileName]
    return availableAppender[indexCategory]
}

fileLogger.getDefaultInfo = (req)=>{
    return {
        url:req.originalUrl,
        ip:req.ip,
    }   
}

module.exports = fileLogger;