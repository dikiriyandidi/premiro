'use strict';

require('dotenv').config();

// set application environment
global.ENV = process.env.NODE_ENV || 'development'
global.path = require('path')

const port = process.env.PORT || 3000
global.express = require('express')
global.myConfig = {}
const fw = express()
const fs = require('fs')
const http = require('http')
const core = require('./core')(fw, __dirname)
const basepath = 'apps/v1'

if(fs.existsSync(path.normalize(__dirname + "/" + basepath + '/config/' + ENV + '/config.js')))
    global.myConfig = require(path.normalize(__dirname + "/" + basepath + '/config/' + ENV + '/config.js'))

core.init(__dirname, basepath)

var httpServer = http.createServer(fw)
httpServer.listen(port, ()=>{
    let port = httpServer.address().port;

    console.log("Application run on port %s", port);
})

// if(myConfig.enable_https != undefined && myConfig.enable_https){
//     const https = require('https')
//     const portHttps = process.env.HTTPSPORT || 3000
//     const privateKey  = fs.readFileSync(myConfig.ssl_key, 'utf8')
//     const certificate = fs.readFileSync(myConfig.ssl_cert, 'utf8')
//     const credentials = {key: privateKey, cert: certificate}
//     var httpsServer = https.createServer(credentials, fw)
//     httpsServer.listen(portHttps)
// }

module.exports = fw
