'use strict'

let randomstring = require("randomstring")
let op = Sequelize.Op

let search = (db,token = false)=> new Promise((resolve, reject)=>{
    db.model('token').findOne({
        where: 
        {
                token_code : token,
           
        },
        include: [{
            model: db.model('token_profile'),
            attributes: ['user_id','admin_id','last_activity']
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

let searchbydeviceid = (db, apps_id, device_id)=> new Promise((resolve, reject)=>{
    db.model('token').findOne({
        where: 
        {     
                apps_id: apps_id,
                device_id: device_id   
        },
        include: [{
            model: db.model('token_profile'),
            attributes: ['user_id','admin_id','last_activity']
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

let searchRefresh = (db,refresh_token)=> new Promise((resolve, reject)=>{
    db.model('token').findOne({
        where: 
        {
                refresh_token : refresh_token,
        },
        include: [{
            model: db.model('token_profile'),
            attributes: ['user_id','admin_id','last_activity']
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

let insert = (db, apps_id, token, refresh_token, device_id, device_type) => new Promise((resolve, reject)=>{
    db.model('token').create({
        token_code: token,
        apps_id: apps_id,
        refresh_token : refresh_token,
        device_id: device_id,
        device_type: device_type
    }).then((data)=>{
        resolve(data)
    })
})

let update = (db, apps_id, token, refresh_token, device_id, device_type, token_id) => new Promise((resolve, reject)=>{
    let dt = new Date()
    dt.setDate(dt.getDate() + 1)
    db.model('token').update({
        token_code: token,
        apps_id: apps_id,
        refresh_token : refresh_token,
        device_id: device_id,
        device_type: device_type,
        expired_date: dt
    },{
        where:{
            id: token_id
        }
    }).then((data)=>{
        resolve(data)
    })
})

let createProfile = (db, token_id, user_id, admin_id) => new Promise((resolve, reject)=>{
    db.model('token_profile').create({
        token_id: token_id,
        ...(user_id && {user_id}),
        ...(admin_id && {admin_id})
    }).then((data)=>{
        resolve(data)
    })
})

let updateProfile = (db, token_id) => new Promise((resolve, reject)=>{
    db.model('token_profile').update({
        last_activity : new Date()
    },{
        where:{
            token_id : token_id
        }
    }).then((data)=>{
        resolve(data)
    })
})

exports.check = search

exports.getbydevice = searchbydeviceid

exports.insertLog = (db, token_data)=>{
    db.model('token_profile').update({
        last_activity: new Date()
    },{
        where:{
            token_id: token_data.id
        }
    }).then((data)=>{
    })
}

exports.createLog = (db, req, token_id)=>new Promise((resolve, reject)=>{
    if(token_id == 0)
        resolve(null)
    db.model('token_log').create({
        token_id: token_id,
        user_agent : req.headers['user-agent'],
        path: req.url,
        method: req.method.toUpperCase(),
        request: ''
    }).then((data)=>{
        /**
         * NOTES:
         * Sensitive data need to be masked
         * Sensitive data can vary from project to project
         */    
        let _body = Object.assign({}, req.body)

        Object.keys(_body).forEach(param => {
            if (myConfig.masked_params.includes(param)) {
                _body[param] = '[hide]'
            }
        })

        // console.log('================== COMPARE VALUE ==================')
        // console.log(req.body)
        // console.log(_body)

        req.lib('log').generateFile(data.id,"request",JSON.stringify(_body));

        resolve(data)
    })
})

exports.updateLog = (db, req ,id, data_response, action, end_time, memory_usage, elapse_time, api_version)=>{
    db.model('token_log').update({
        final_action: action,
        end_date: end_time,
        memory_usage: memory_usage, 
        time_elapse: elapse_time, 
        api_version: api_version,
        response: ''
    },{
        where:{
            id: id
        }
    }).then((data)=>{

        req.lib('log').generateFile(id,"response",JSON.stringify(data_response));
        //TODO: push response to log file
    })
}

exports.refresh = (db, refresh_token, token) => new Promise ((resolve, reject)=>{ 
    (async()=>{
        let cek = await search(db,token)
        if(cek != null)
        {
            if(cek.refresh_token != refresh_token){
                throw (new MyError("Mismatch token",200, 408))
                reject("Mismatch token");
            }
            let token_code = randomstring.generate()
            let cek_new = null
            do
            {
                cek_new = await search(db, token_code)
                if(cek_new != null && cek_new.id == cek.id)
                {
                    token_code = randomstring.generate()
                    cek_new = null
                }
            }
            while(cek_new != null)
            let dt = new Date()
            dt.setDate(dt.getDate() + 1)
            cek.token_code = token_code
            cek.expired_date = dt
            db.model('token').update({
                expired_date: dt,
                token_code: token_code
            },{
                where:{
                    id: cek.id
                }
            }).then((data)=>{
            })
            resolve(cek)
        }
        else
            throw (new MyError("Mismatch token", 200, 408))
    })();
})

exports.updateActivity = (db, token_data)=>{
    let dt = new Date()
    dt.setDate(dt.getDate() + 1)
    db.model('token').update({
        expired_date: dt
    },{
        where:{
            id: token_data.id
        }
    }).then((data)=>{
    })
    db.model('token_profile').update({
        last_activity: new Date()
    },{
        where:{
            token_id: token_data.id
        }
    }).then((data)=>{
    })
}

exports.generate = (db, apps_id, device_id, device_type) =>new Promise ((resolve, reject)=>{ 
    (async()=>{
        let cek = 0;
        let token_code = randomstring.generate();
        while(cek != null)
        {
            cek = await search(db, token_code);
            if(cek != null)
                token_code = randomstring.generate();
        }

        cek = 0;
        let refresh_token = randomstring.generate();
        while(cek != null)
        {
            cek = await searchRefresh(db, refresh_token);
            if(cek != null)
                refresh_token = randomstring.generate();
        }
        let token = await insert(db, apps_id, token_code, refresh_token, device_id, device_type);
        await createProfile(db,token.id);
        
        resolve(token);
    })()
})

exports.regenerate = (db, token, apps_id, device_id, device_type) =>new Promise ((resolve, reject)=>{ 
    (async()=>{
        let cek = 0;
        let token_code = randomstring.generate();
        while(cek != null)
        {
            cek = await search(db, token_code);
            if(cek != null)
                token_code = randomstring.generate();
        }

        cek = 0;
        let refresh_token = randomstring.generate();
        while(cek != null)
        {
            cek = await searchRefresh(db, refresh_token);
            if(cek != null)
                refresh_token = randomstring.generate();
        }
        await update(db, apps_id, token_code, refresh_token, device_id, device_type, token.id);
        await updateProfile(db,token.id);
        token.token_code = token_code;
        token.refresh_token = refresh_token;
        resolve(token);
    })()
})

exports.updateTokenProfile = (db, user_id, token_id) => {
    db.model('token_profile').update({
        user_id: user_id
    }, {
        where:{
            token_id: token_id
        }
    }).then((data) => {
        data
    })
}
//GET USER DATA
let getDataUserById = (db, user_id) => new Promise((resolve, reject) => {
    db.model('user').findOne({
        where: {
            id: user_id
        },
        attributes: ['id', 'spice_id', 'unique_id', 'fullname', 'gender', 'birthdate', 'city_id', 'valid_phone_number', 'valid_email', 'subscribe', 'point', 'registration_date', 'register_cell_id', 'profile_picture', 'insert_date']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getUserData = (db, token) =>new Promise ((resolve, reject)=>{ 
    (async()=>{
        let cek = await search(db, token);
        if(cek != null) {
            if(cek.token_profile.user_id == null) {
                throw new MyError("Your session has been expired, please re-login.",200, 407);
            }
            let data = await getDataUserById(db, cek.token_profile.user_id);
            data['token_id'] = cek.id;
            resolve(data);
        }else{
            reject("Mismatch token");
        }
    })();
})

// query ini buat ngecek user login atau belum karena ada page yang butuh user login dan tidak login

exports.getUserDataNotLogin = (db, token) =>new Promise ((resolve, reject)=>{ 
    (async()=>{
        let cek = await search(db, token);
        if(cek != null) {
            if(cek.token_profile.user_id == null) {
                resolve(undefined);
            }
            let data = await getDataUserById(db, cek.token_profile.user_id);
            data['token_id'] = cek.id;
            resolve(data);
        }else{
            throw new MyError("Mismatch token",200, 408);
        }
    })();
})

exports.gettokenprofile = (db, token_code) => new Promise((resolve, reject)=>{
    (async()=>{
        console.log("hello world!");
        let res = db.model("token_profile").findAll({
            include:[{
                model: db.model('token'),
                // attributes: ['user_id','admin_id','last_activity']
                where: {
                    token_code: token_code
                }
            }]
        }).then(data=>resolve(data));
    })();
})

exports.deleteTokenLogBeforeBackDate = async (db, backdate) => {
    return await db
        .model('token_log')
        .destroy({
            where: {
                end_date: {
                    [op.lte]: backdate
                }
            }
        })
}