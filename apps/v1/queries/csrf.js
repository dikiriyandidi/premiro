'use strict'

exports.getCSRFbySessionID = (db, sessionID)=>new Promise((resolve, reject)=>{
    db.model('sessions_csrf').findOne({
        where: {
            session_id : sessionID
        }
    }).then((data)=>{
        resolve(data)
    })
})

exports.insertCSRF = (db, data)=>new Promise((resolve, reject)=>{
    db.model('sessions_csrf').create(data).then((data)=>{
        resolve(data)
    })
})

exports.updateCSRF = (db, data, sessionID)=>new Promise((resolve, reject)=>{
    db.model('sessions_csrf').update(data, {
        where: {session_id: sessionID}
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

