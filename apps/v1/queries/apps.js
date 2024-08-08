'use strict'

exports.checkApps = (db, name, secret_key)=>new Promise((resolve, reject)=>{
    db.model('apps').findOne({
        where: {
            name: name,
            secret_key: secret_key
        }
    }).then((data)=>{
        resolve(data)
    })
})