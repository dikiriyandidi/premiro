'use strict'
let randomstring = require("randomstring")
let crypto = require('crypto')
//Encrypt Password For SPICE:
exports.encryptPasswordSpice = (username, pwd) => {
    username = username.toLowerCase()
    while(username.length < 30)
    {
        username += " "
    }
    username = username.substr(0, 30);

    let s = pwd + username
    let ret = crypto.createHash('sha1').update(s).digest('binary')
    let newstring = ret + username
    let enc_pass = new Buffer(newstring, 'binary').toString('Base64')
    return enc_pass
}

exports.encryptData = (data) => {
    let enc_data = crypto.createHash('md5').update(data).digest("Base64")
    enc_data = new Buffer(enc_data, 'Base64').toString('hex')
    return enc_data
}
// require('make-runnable')

//[Mudita]: Create Encrypt Password with random salt
let encryptPasswordCms = (pwd, salt = '')=>{
    if(salt == '')
        salt = randomstring.generate({
            length: 6,
            charset: 'alphanumeric'
        })
    return '$' + salt + '$.' + crypto.createHash('sha256').update(salt+pwd).digest('base64')
}

exports.encryptPasswordCms = ( pwd )=> {
    return encryptPasswordCms(pwd)
};

exports.checkPasswordCms = (encpwd ,pwd ) => {
    encpwd = encpwd.toString()
    let salt = encpwd.substr(1,6)
    return (encryptPasswordCms(pwd, salt) === encpwd)
}