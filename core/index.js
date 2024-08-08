'use strict'

let core = (fw) => {
    let $initialize = false

    // set framework options
    fw.set('x-powered-by', false)
    fw.set('trust proxy', true)

    // set template engine

    // extend response
    require('./response.js')(fw)

    return {
        init: (rootpath, basepath) => {

            // load logger
            global.myLogger = require('./logger.js')
            global.MyError = require('./libs/error.js')
            global.fileLogger = require('./filelogger.js')
            
            global.fs = require('fs')

            if ($initialize) {
                throw new MyError('Application has been initialized!', 500, 500)
                return
            }

            $initialize = true

            // initialize database connection
            fw.db = require('./dbcore/index.js')(rootpath, basepath)
                
            // load  middlewares
            require('./middlewares.js')(fw, rootpath, basepath)

            // load application
            let app = require(rootpath + '/' + basepath)

            // load core functions
            let fn = require('./functions.js')(fw, rootpath, basepath)

            app(fn)
            
            for(let i in myConfig.static_files)
            {
                fw.use(express.static(path.join(rootpath, myConfig.static_files[i])))
            }

            // non existing route
            fw.use((req, res) => {
                let idxCheckHeader = -1
                for(let i in myConfig.check_header)
                {
                    let regexp = new RegExp(myConfig.check_header[i] + "*",'gi')
                    if(regexp.test(req.url))
                    {
                        idxCheckHeader = i
                        break
                    }
                }
                if(idxCheckHeader > -1)
                    res.notfound('Page not found!')
                else
                    res.render('404')
            })
            // error handler
            fw.use((err, req, res, next) => {
                global.myLogger.error(err)
                if(!err.http_status_code) {
                    err.http_status_code = 500
                }
                
                if(err.option) req.lib("error_handler").fileLoggerHandler(err)
                
                res.error(err.message, err.http_status_code, err.code)
            })
        }
    }
}

module.exports = core