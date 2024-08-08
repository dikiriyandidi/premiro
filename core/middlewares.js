'use strict'

let nocache = require('nocache')
let xss = require('xss')
let multer = require('multer')
let os = require('os')
let pug = require('pug')
var uaparse = require('user-agent-parser')
const uacAccess = require("./libs/uac/uac_middleware")
const helmet = require('helmet')

// let multiparty = require('multiparty')
// var multipart = require('connect-multiparty')

let CleanXSS = (param) => {

    const option = {
        stripIgnoreTag: true,
        stripIgnoreTagBody: false, // see https://github.com/weseek/growi/pull/505
        css: false,
        whiteList: [],
        escapeHtml: (html) => {
            return html
        }, // resolve https://github.com/weseek/growi/issues/221
    };

    // tagWhiteList.forEach((tag) => {
    //     whiteListContent[tag] = attrWhiteList;
    // });

    // create the XSS Filter instance
    let myxss = new xss.FilterXSS(option);


    return myxss.process(unescape(param))
}

let CleanSQLInjection = (param) => {
    let list_query = ["create", "delete", "update", 'select', 'drop', 'truncate', 'sleep', 'insert', "'", '"'];
    for (let i in list_query) {
        let re = new RegExp(list_query[i], 'gi');
        if (list_query[i] == 'create' || list_query[i] == 'update' || list_query[i] == 'delete') {
            if (param.length > 20) {
                param = param.toString().replace(re, '');
            }
        } else {
            param = param.toString().replace(re, '');
        }

    }

    return param
}

//[William]: plan to make a function to sanitize the data
let SanitizeAll = (params) => {
    for (let i in params) {
        if (typeof params[i] == "string") {
            if (i !== 'content' && i !== 'description' && i !== 'description2' && i !== 'description3') {
                params[i] = CleanXSS(params[i])
            }
            // kasi else untuk clean javascript nya
            params[i] = CleanSQLInjection(params[i])
        } else if (typeof params[i] == "object") {
            SanitizeAll(params[i])
        }
    }
}

let handleCsrf = async (req, res, next) => {
    if (myConfig.csrf_protection) {
        const randomstring = require("randomstring")
        let regenerate = true

        let csrf_mysql = await req.queries('csrf').getCSRFbySessionID(req.db, req.sessionID)

        if (csrf_mysql == null || csrf_mysql.csrf_storage == undefined || csrf_mysql.csrf_storage == null) {
            csrf_mysql = {}
            csrf_mysql.csrf_storage = new Array()
        } else
            csrf_mysql.csrf_storage = JSON.parse(csrf_mysql.csrf_storage)
        //check csrf
        if (req.is_ajax)
            regenerate = false
        if (req.method.toUpperCase() == 'POST') {
            if (req.body[myConfig.csrf_token_name] == undefined) {
                next(new MyError('Action is not allowed', 403, 403))
                return
            }
            // select dari db by sessionID
            if (csrf_mysql == null || csrf_mysql.csrf_storage == undefined || csrf_mysql.csrf_storage == null) {
                next(new MyError('Action is not allowed', 403, 403))
                return
            } else {
                //get from db, check ada apa engga base on csrf nya
                if (csrf_mysql.csrf_storage.indexOf(req.body[myConfig.csrf_token_name]) < 0) {
                    next(new MyError('Action is not allowed', 403, 403))
                    return
                }
            }
        }

        //hanya ketika nge POST aja dapat yang baru
        if (req.method.toUpperCase() != 'POST' && csrf_mysql.csrf_storage.length > 0) {
            regenerate = false
        }

        if (regenerate) {
            let random = randomstring.generate()
            // req.csrf_token = random

            let insert = csrf_mysql.csrf_storage.length > 0 ? false : true
            csrf_mysql.csrf_storage.push(random)


            //req.session.csrf_storage diganti dengan select from session_csrf where sessionID = req.sessionID
            if (csrf_mysql.csrf_storage.length > myConfig.max_csrf)
                csrf_mysql.csrf_storage.shift() //proses diganti dengan proses delete

            if (insert)
                await req.queries('csrf').insertCSRF(req.db, {
                    session_id: req.sessionID,
                    csrf_storage: JSON.stringify(csrf_mysql.csrf_storage)
                })
            else
                await req.queries('csrf').updateCSRF(req.db, {
                    csrf_storage: JSON.stringify(csrf_mysql.csrf_storage)
                }, req.sessionID)
            //proses diganti dengan proses insert

        }
    }
}

let loadMiddlewares = (app, rootpath, basepath) => {
    const bodyParser = require('body-parser')
    const cookieParser = require('cookie-parser')
    const session = require('express-session')
    const timeout = require('connect-timeout')

    //session di db
    const SessionStore = require('express-session-sequelize')(session.Store)
    // const dbconfig = require(rootpath + '/' + basepath + '/config/' + ENV + '/database.js')

    app.use(helmet({
        frameguard: {
            action: 'sameorigin'
        }
    }))

    let max_age = 365 * 24 * 60 * 60;
    app.use(helmet.hsts({
        maxAge: max_age,
        includeSubDomains: true,
        preload: true,
        force: true
    }))


    if (myConfig.hsts) app.use(helmet.hsts(myConfig.hsts))
    if (myConfig.csp) app.use(helmet.contentSecurityPolicy({
        directives: myConfig.csp
    }))
    if (myConfig.referrerPolicy) app.use(helmet.referrerPolicy(myConfig.referrerPolicy))


    app.set('views', rootpath + '/views')
    app.set('view engine', 'pug')

    app.use(bodyParser.json({
        limit: myConfig.max_post_size || '5mb'
    }))
    app.use(bodyParser.urlencoded({
        limit: myConfig.max_post_size || '5mb',
        extended: true
    }))
    app.use(bodyParser.raw({
        limit: myConfig.max_post_size || '5mb',
        parameterLimit: 1000000,
        type: 'application/octet-stream'
    }))
    app.use(cookieParser())

    // Removing max session (unused)
    // let max_session = 86400000
    // if (myConfig.session_expired != undefined)
    //     max_session = myConfig.session_expired

    let myDatabase = {}

    if (process.env.IS_REPLICATION == 'true') {
        myDatabase = new Sequelize(process.env.DB_NAME, null, null, {
            dialect: process.env.DB_DIALECT,
            logging: false,
            timezone: process.env.TZ,
            replication: {
                read: [{
                    host: process.env.DB_R_HOST,
                    username: process.env.DB_R_USERNAME,
                    password: process.env.DB_R_PASSWORD,
                    port: process.env.DB_R_PORT
                }],
                write: {
                    host: process.env.DB_W_HOST,
                    username: process.env.DB_W_USERNAME,
                    password: process.env.DB_W_PASSWORD,
                    port: process.env.DB_W_PORT
                }
            }
        });
    } else {
        myDatabase = new Sequelize(process.env.DB_NAME, process.env.DB_W_USERNAME, process.env.DB_W_PASSWORD, {
            host: process.env.DB_W_HOST,
            dialect: process.env.DB_DIALECT,
            port: process.env.DB_W_PORT || 3306,
            logging: false,
            timezone: process.env.TZ
        });
    }

    const sequelizeSessionStore = new SessionStore({
        db: myDatabase,
    });

    let sessOption = {
        secret: myConfig.session_secret || 'its a secret!',
        name: myConfig.session_name || 'session_name',
        resave: false,
        saveUninitialized: false,
        store: sequelizeSessionStore
    }

    if (process.env.NODE_ENV != 'local') {
        sessOption.cookie = {
            httpOnly: true,
            secure: true
        }
    }
    
    app.use(session(sessOption));

    // if (process.env.NODE_ENV == 'local') {
    //     app.use(session({
    //         secret: myConfig.session_secret || 'its a secret!',
    //         name: myConfig.session_name || 'session_name',
    //         resave: false,
    //         saveUninitialized: false,
    //         // cookie: {
    //         //     // maxAge: max_session,
    //         //     // ephemeral: false,
    //         //     httpOnly: true,
    //         //     // secureProxy: true,
    //         //     secure : true
    //         // },
    //         store: sequelizeSessionStore
    //     }))
    // } else {
    //     app.use(session({
    //         secret: myConfig.session_secret || 'its a secret!',
    //         name: myConfig.session_name || 'session_name',
    //         resave: false,
    //         saveUninitialized: false,
    //         cookie: {
    //             // maxAge: max_session,
    //             // ephemeral: false,
    //             httpOnly: true,
    //             // secureProxy: true,
    //             secure: true
    //         },
    //         store: sequelizeSessionStore
    //     }))
    // }
    // app.use(session({
    //     secret: myConfig.session_secret || 'its a secret!',
    //     name: myConfig.session_name || 'session_name',
    //     resave: false,
    //     saveUninitialized: false,
    //     // Remove due to unused config. Now storing session in database.
    //     // cookie: {
    //     //     maxAge: max_session,
    //     //     ephemeral: false,
    //     //     httpOnly: true,
    //     //     secureProxy: true,
    //     // },
    //     store: sequelizeSessionStore
    // }))



    app.use(multer({
        dest: os.tmpdir()
    }).any())

    //begin get & set header data
    // let setHeaders = function (req, res, next) {
    // myLogger.info('new-request', req.headers)
    //if required to check header
    // if (req.headers.hasOwnProperty('mony-user-data')) {
    //     req.user = JSON.parse(req.headers['mony-user-data'])
    // }else{
    //     next(new Error('Invalid User Information!'))
    // }
    //     next()
    // }

    // app.use(setHeaders)
    //end get & set header data

    //set header method DELETE, PUT -> for handle cross error

    app.use((async (req, res, next) => {
        //check first time memory usage
        req.memory_used = process.memoryUsage().heapUsed

        //check static file
        let is_static = false
        for (let i in myConfig.static_paths) {
            let regexp = new RegExp(myConfig.static_paths[i], 'gi')
            if (regexp.test(req.url)) {
                //check if forbidden path
                if (myConfig.static_paths[i] == myConfig.forbidden_path) {
                    if (req.session == undefined || req.session.admin_id == undefined || req.session.admin_id == 0) { // jika dalam keadaan tidak login, langsung di redirect ke halaman login (tidak bisa akses filenya)
                        res.redirect(myConfig.login_admin)
                        return
                    } else {
                        // uncomment with valid logic
                        // let allowed_menu = await check user access //
                        // console.log(allowed_menu)

                        // let action_allowed = allowed_menu.map(row=>row.action_type)

                        // let is_have_access = false
                        // for (let i in action_allowed) {
                        //     if(action_allowed[i] === 'export'){
                        //         is_have_access = true
                        //         break
                        //     }
                        // }

                        // if (is_have_access === false) {
                        //     res.redirect(req.session.home_page)
                        //     return
                        // }

                        is_static = true
                        break
                    }
                } else {
                    is_static = true
                    break
                }
            }
        }

        if (!is_static) {
            req.request_id = 0
            //check first time request
            req.start_process = (new Date()).getTime()

            //[William]: log
            myLogger.info('new-request', 'CLIENT IP: ' + req.ip)
            myLogger.info('new-request', 'URL: ' + req.url)
            // myLogger.info('new-request', 'HOST: ' + req.headers.host)
            // myLogger.info('new-request', 'ORIGIN: ' + req.headers.origin)
            // myLogger.info('new-request', 'User Agent: ' + req.headers['user-agent'])

            //define ajax or not
            req.is_ajax = req.headers.hasOwnProperty('x-requested-with')

            //define device type
            //parse user agent
            let device = uaparse(req.headers['user-agent'])

            req.is_mobile = false
            req.os = 'Desktop'
            if (device.os.name != undefined)
                req.os = device.os.name
            req.is_mobile = (device.device.type != undefined && device.device.type == 'mobile')

            //[William]: enable CORS => di setting per apps sesuai dengan environment-nya
            for (let i = 0; i < myConfig.allowed_origin.length; i++) {
                let reg = myConfig.allowed_origin[i]
                if (reg[0] == '*') {
                    reg = '[a-z0-9]' + reg
                }
                let regexp = new RegExp(reg, 'gi')
                let allow = ''
                if (regexp.test(req.ip)) {
                    allow = req.ip
                } else if (regexp.test(req.headers.origin)) {
                    let domain_header = req.headers.origin.split('/')
                    let domain_origin = reg.split('/')
                    let reg_localhos = (new RegExp('localhost', 'gi'))
                    
                    if (reg_localhos.test(domain_header[2])) {
                        let domain = domain_header[2].split(':')
                        if (domain_origin == domain[0]) {
                            allow = req.headers.origin
                        }

                    } else if (domain_origin[2] != domain_header[2]) {
                        allow = ''
                    } else {
                        allow = req.headers.origin
                    }

                }

                if (allow != '') {

                    //if localhost allow all
                    if (allow == '::1') {
                        allow = '*'
                    }

                    res.header("Access-Control-Allow-Origin", allow)
                }
            }
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,mode, " + myConfig.header_key)
            // res.header('Access-Control-Allow-Credentials', myConfig.allowed_credentials);
            // res.header('Access-Control-Allow-Methods', myConfig.allowed_method.join());

            let idxCheckHeader = -1
            for (let i in myConfig.check_header) {
                let regexp = new RegExp(myConfig.check_header[i] + "*", 'gi')
                if (regexp.test(req.url)) {
                    idxCheckHeader = i
                    break
                }
            }

            if (idxCheckHeader > -1) {
                let idxNoHeader = -1
                for (let i in myConfig.allowed_no_header) {
                    let regexp = new RegExp(myConfig.allowed_no_header[i] + "*", 'gi')
                    if (regexp.test(req.url)) {
                        idxNoHeader = i
                        break
                    }
                }
                if (idxNoHeader < 0) {
                    let token_data = null
                    let token_query = req.queries('token')
                    if (req.headers.hasOwnProperty(myConfig.header_key)) {
                        let token = req.headers[myConfig.header_key]
                        //cek token
                        token_data = await token_query.check(req.db, token, req.ip, myConfig.token_match_ip)
                        req.token = token
                    }
                    let token_id = 0
                    if (req.url != '/' && req.method.toUpperCase() != 'OPTIONS') {
                        if (token_data == null) {
                            next(new MyError('Please provide correct token!', 401, 101)) // Aswin [09/09/2020] Respond with 401 for invalid token
                            return
                        } else {
                            token_id = token_data.id
                            if (token_data.expired_date.getTime() <= (new Date()).getTime()) {
                                next(new MyError('Token already expired!', 401, 100)) // Aswin [09/09/2020] Respond with 401 for expired token
                                return
                            } else
                                token_query.updateActivity(req.db, token_data)
                        }
                        let obj = await token_query.createLog(req.db, req, token_id)
                        if (obj != null)
                            req.session.request_id = obj.dataValues.id
                        if (fs.existsSync(path.normalize(rootpath + '/' + basepath + '/apiaccess'))) {
                            let access = require(path.normalize(rootpath + '/' + basepath + '/apiaccess'))
                            if (access.check != undefined) {
                                let res_check = await access.check(req.db, req)
                                if (!res_check) {
                                    next(new MyError('Page is not accessible!', 403, 403))
                                    return
                                }
                            }
                        }
                    }

                }
            } else {

                let idxNoCSRF = -1
                for (let i in myConfig.csrf_bypass) {
                    let regexp = new RegExp(myConfig.csrf_bypass[i] + "*", 'gi')
                    if (regexp.test(req.url)) {
                        idxNoCSRF = i
                        break
                    }
                }

                //handle csrf if not static
                if (idxNoCSRF < 0)
                    await handleCsrf(req, res, next)

                let idxCheckAdmin = -1
                for (let i in myConfig.validate_admin) {
                    let regexp = new RegExp(myConfig.validate_admin[i] + "*", 'gi')
                    if (regexp.test(req.url)) {
                        idxCheckAdmin = i
                        break
                    }
                }

                //handle csrf if not static
                if (idxCheckAdmin >= 0 && req.url != myConfig.login_admin) {
                    if (req.session == undefined || req.session.admin_id == undefined || req.session.admin_id == 0) {
                        if (req.method.toUpperCase() == 'GET') {
                            res.redirect(myConfig.login_admin)
                            return
                        }
                        if (req.method.toUpperCase() == 'POST') {
                            next(new MyError('Action is not allowed', 403, 403))
                            return
                        }
                    } else {
                        if (fs.existsSync(path.normalize(rootpath + '/' + basepath + '/access'))) {
                            let access = require(path.normalize(rootpath + '/' + basepath + '/access'))

                            if (access.check != undefined) {
                                let res_check = await access.check(req.db, req)
                                if (!res_check) {
                                    res.render('404_cms')
                                    return
                                }
                            }
                        }
                    }
                }
            }

            //[William] : make more ci-fy
            req.input = {
                get: req.query,
                post: req.body
            }
            //[William]: clean up xss
            SanitizeAll(req.input.get)
            // merubah post menjadi string
            SanitizeAll(req.input.post)
        }
        next()
    }))

    app.use(nocache())
    app.use(timeout(myConfig.max_timeout || 300))
    // app.use(function (req, res, next){
    //     if (!req.timedout) next()
    // })



    app.use(uacAccess.cmsUac)

    if (ENV !== 'production') {
        // for environment other than production
        let morgan = require('morgan')

        app.use(morgan('dev'))
    } else {
        // for environment only on production
    }
}

module.exports = loadMiddlewares