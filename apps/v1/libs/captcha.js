const superagent = require('superagent')
// const ENV = process.env.NODE_ENV || 'development'
// let myConfig = require('../config/' + ENV + '/config.js')

let checkGRecaptcha = async (req) => {
    let form = {
        secret: myConfig.secretkey,
        response: req.body['g-recaptcha-response'],
        remoteip: req.ip
    }

    let response = await superagent
        .post('https://www.google.com/recaptcha/api/siteverify')
        .type('form')
        .send(form)
    
    return response.body
}

// module.exports.checkGRecaptcha = checkGRecaptcha
module.exports.checkGRecaptcha = checkGRecaptcha
