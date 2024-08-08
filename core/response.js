'use strict'
const uacAccess = require("./libs/uac/uac_response")
const webLog = require("./libs/web_logs/web_log_response")

let convertByte = (byte) => {
    let arr = ['Byte','KB','MB','GB','TB']
    let idx = 0
    while(byte > 999 && idx < 5)
    {
        byte = Math.round(byte*100/1000)/100
        idx++
    }
    let size = ''
    if(idx >= 0 && idx <= arr.length-1)
        size = ' ' + arr[idx]
    if(byte < 0)
        byte = 0
    return byte.format(2,3) + size
}

let updateLog = (db, req, id, data, action, end_time, memory_usage, elapse_time, api_version)=>{
    if(id != 0 && id != undefined && id != null){
        let q = req.queries('token')
        q.updateLog(db, req,id, data, action, end_time, memory_usage, elapse_time, api_version)
    }

    if(req.session && req.session.request_id) req.session.destroy((err) => { /*console.log(err);*/ })
    
}

module.exports = fw => {
    fw.use(uacAccess.response)
    
    fw.use((req, res, next) => {
        res.source_url = req.url

        res._render = res.render
        
        res.render = (view, data = {}) => {
            (async() =>{
                let menus = []
                let curr_dt = new Date()

                // comment to save for future
                let csrf_mysql = await req.queries('csrf').getCSRFbySessionID(req.db,req.sessionID)
                let last_csrf = ''

                if(csrf_mysql != null){
                    last_csrf = JSON.parse(csrf_mysql.csrf_storage)
                    last_csrf = last_csrf[last_csrf.length-1]
                }
                
                // data.csrf_token = req.csrf_token
                data.csrf_token = last_csrf
                
                data.csrf_token_name = myConfig.csrf_token_name
                data.succ_message = ''
                data.err_message = ''
                if(req.session != undefined){
                    if(req.session.succ_message != undefined && req.session.succ_message != '')
                        data.succ_message = req.session.succ_message
                    if(req.session.err_message != undefined && req.session.err_message != '')
                        data.err_message = req.session.err_message
                    req.session.succ_message = ''
                    req.session.err_message = ''
                    let user_menus = []
                    if(req.session.admin_id != undefined && req.session.admin_id != 0){
                        let uq = req.queries("admin")
                        user_menus = await uq.getUserMenu(req.db, req.session.admin_id, res.source_url)
                    }
                    data.user_menus = user_menus
                }
                updateLog(req.db, req, req.session ? req.session.request_id : '', data, 'render', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)  
                
                data = await uacAccess.renderData(req,data)
                webLog.wlRender(req,res,{status_code:200})

                res._render(view, data)    
                
            })()
        }
        
        res.setHeader('Version', myConfig.version)

        res.success = (data, status_code = 200) => {
            
            let curr_dt = new Date()
            
            updateLog(req.db, req, req.session ? req.session.request_id : '', data, 'success', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            webLog.wlSuccess(req,res,{status_code})

            res.status(status_code).json({
                api_version: myConfig.version,
                memory_usage: convertByte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                code: status_code,
                error: {},
                data: data
            })
        }

        res.html = (html, status_code = 200) => {
            res.status(status_code).send(html)
        }

        res.raw = (data, status_code = 200) => {
            let curr_dt = new Date()
            data.api_version = myConfig.version
            data.memory_usage = convertByte(process.memoryUsage().heapUsed - req.memory_used)
            data.elapse_time = (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3)
            data.lang = 'en'
            // data.error = {}
            updateLog(req.db, req, req.session ? req.session.request_id : '', data, 'raw', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            webLog.wlRaw(req,res,{status_code})

            res.status(status_code).json(data)
        }

        // Aswin [09/09/2020] if not mentioned, status_code should be the same as http_status_code
        // Mudit [17/10/2018] add new param http_status_code & pass to res.status
        res.error = (err, http_status_code = 400, status_code) => {
            let message = ''
            let data = []

            if(!status_code) {
                status_code = http_status_code
            }
            
            // if err is string
            if (typeof err === 'string') {
                // message = err
                data.push({
                    code: status_code,
                    message: err
                });
            }
            // if err is object
            else if (typeof err === 'object') {
                if(Object.prototype.toString.call( err ) === '[object Array]')
                {
                    for(let i in err)
                    {
                        data.push({
                            code: status_code,
                            message: err[i]
                        })
                    }
                }
                else if (!err.errors) {
                    // message = err.message
                    data.push({
                        code: status_code,
                        message: message
                    })
                } else {
                    // message = err.errors
                    data = [{
                        code: status_code,
                        message: err.errors
                    }]
                }
            }

            // Mudit [17/10/2018] add concate final message
            let final_message = '';
            data.map( x => final_message+= x.message + ' ');
            final_message = final_message.slice(0, -1); //removing last white space
            //End concate final message

            let curr_dt = new Date()
            updateLog(req.db, req, req.session ? req.session.request_id : '', data, 'error', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            
            if(req.method.toUpperCase() == 'OPTIONS') // Mudit [18/10/2019] update logic handling OPTIONS must return 200 http code
                http_status_code = 200;
            
            webLog.wlError(req,res,{status_code})
            // Mudit [17/10/2018] pass http_status_code
            res.status(http_status_code).json({
                api_version: myConfig.version,
                memory_usage: convertByte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                code: status_code,
                error: {
                    // message: data[0].message,
                    message: final_message,
                    errors: data
                },
                data: {}
            })
        }

        res.notfound = message => {
            let curr_dt = new Date()
            updateLog(req.db, req, req.session ? req.session.request_id : '', {}, 'notfound', curr_dt, process.memoryUsage().heapUsed - req.memory_used, (((curr_dt.getTime() - req.start_process)*100/1000)/100), myConfig.version)
            
            webLog.wlNotFound(req,res,{status_code:404})
            res.status(404).json({
                api_version: myConfig.version,
                memory_usage: convertByte(process.memoryUsage().heapUsed - req.memory_used),
                elapse_time: (((curr_dt.getTime() - req.start_process)*100/1000)/100).format(2,3),
                lang: 'en',
                code: 404,
                error:{
                    message: message,
                    errors: [{
                        code: 404,
                        message: message
                    }]
                },
                data: {}
            })
        }

        next()
    })    
}