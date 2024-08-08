'use strict';

let log4js = require('log4js');
let logconfig = {
        "appenders":{
            wkndlog:{
                "type":"file", 
                "filename":"logs/service.log", 
                "maxLogSize":102400000, 
                "backups":50, 
                "category":process.env.NAMESPACE
            },
            devlog:{
                type: "console"
            }
        },
        categories:{
            default:{
                appenders:["wkndlog"], 
                level: "ALL"
            }
        }

};

//[William]: cek jika development maka tampilkan error di console
if(ENV == 'development')
{
    logconfig.categories.default.appenders.push("devlog");
}

log4js.configure(
    logconfig
    );
let logger = log4js.getLogger(process.env.NAMESPACE);
// logger.setLevel('trace');

let myLogger = {};
myLogger.logconfig = logconfig

// how to use :
// myLogger.trace('lorem', string);
// myLogger.trace('lorem', obj);
// myLogger.trace('lorem', array);
myLogger.trace = (action, message) => {
    myLogger.push('trace', action, message);
};

// how to use :
// myLogger.debug('lorem', string);
// myLogger.debug('lorem', obj);
// myLogger.debug('lorem', array);
myLogger.debug = (action, message) => {
    myLogger.push('debug', action, message);
};

// how to use :
// myLogger.info('lorem', string);
// myLogger.info('lorem', obj);
// myLogger.info('lorem', array);
myLogger.info = (action, message) => {
    myLogger.push('info', action, message);
};

// how to use :
// myLogger.warn('lorem', string);
// myLogger.warn('lorem', obj);
// myLogger.warn('lorem', array);
myLogger.warn = (action, message) => {
    myLogger.push('warn', action, message);
};

// how to use :
// myLogger.error('lorem', string);
// myLogger.error('lorem', obj);
// myLogger.error('lorem', array);
myLogger.error = (action, message) => {
    myLogger.push('error', action, message);
};

// how to use :
// myLogger.fatal('lorem', string);
// myLogger.fatal('lorem', obj);
// myLogger.fatal('lorem', array);
myLogger.fatal = (action, message) => {
    myLogger.push('fatal', action, message);
};


myLogger.push = (type, action, message) => {

    let newMessage = {"message":message};
    if(typeof message === 'object') {
        newMessage = JSON.stringify(message);
    }
    let newData = {"action": action, "data": newMessage};
    if(type == 'trace') {
        logger.trace(newData);
    }else if(type == 'debug') {
        logger.debug(newData);
    }else if(type == 'info') {
        logger.info(newData);
    }else if(type == 'warn') {
        logger.warn(newData);
    }else if(type == 'error') {
        logger.error(newData);
    }else if(type == 'fatal') {
        logger.fatal(newData);
    }
};

module.exports = myLogger;