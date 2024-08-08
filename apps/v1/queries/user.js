'use strict'

let randomstring = require("randomstring")
let crypto = require('crypto')

exports.updateTokenProfile = (db, data, token_id) => {
    db.model('token_profile').update(data, {
        where:{
            token_id: token_id
        }
    }).then((data) => {
        data
    })
}

exports.updateUser = (db, data, user_id) => {
    db.model('user').update(data, {
        where:{
            id: user_id
        }
    }).then((data) => {
        data
    })
}

exports.updateUniqueId = (db, unique_id, user_id) => {
    db.model('user').update({
        unique_id: unique_id
    }, {
        where:{
            id: user_id
        }
    }).then((data) => {
        data
    })
}

exports.getDataUserByUniqueId = (db, unique_id) => new Promise((resolve, reject) => {
    db.model('user').findOne({
        where: {
            unique_id: unique_id
        },
        attributes: ['id', 'unique_id', 'spice_id', 'fullname', 'gender', 'birthdate', 'city_id', 'valid_phone_number', 'valid_email', 'registration_date', 'register_cell_id', 'profile_picture', 'insert_date']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getDataUser = (db, spice_id) => new Promise((resolve, reject) => {
    db.model('user').findOne({
        where: {
            spice_id: spice_id
        },
        // attributes: ['id', 'spice_id', 'unique_id', 'fullname', 'gender', 'birthdate', 'city_id', 'valid_phone_number', 'valid_email', 'registration_date', 'register_cell_id', 'profile_picture', 'insert_date']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.insertUser = (db, data) => new Promise(
    (resolve, reject) => {
        db.model('user').create(data).then((data) => {
            resolve(data.get('id'))
        }).catch(reject)
    }
)

//insert subscriber:
exports.insertSubscriber = (db, data) => new Promise(
    (resolve, reject) => {
        db.model('subscriber').create(data).then((data) => {
            resolve(data.get('id'))
        }).catch(reject)
    }
)

exports.updateUserInterest = (db, data, wheredata) => new Promise((resolve, reject) => {
    db.model('user_interest').update(data, {
        where:wheredata
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.checkInterest = (db, user_id, interest_id) => new Promise((resolve, reject) => {
    db.model('user_interest').findOne({
        where: {
            user_id: user_id,
            interest_id: interest_id/*,
            status: 'Published'*/
        },
        attributes: ['user_id', 'interest_id', 'date', 'status']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.insertInterest = (db, data) => new Promise((resolve, reject) => {
    db.model('user_interest').create(data).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getSecurityQuestion = (db, code) => new Promise((resolve, reject) => {
    db.model('master_security_question').findOne({
        where: {
            security_code: code
        },
        attributes: ['id', 'security_question']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getPendingForgot = (db, code) => new Promise((resolve, reject) => {
    db.model('temp_forgot_pass').findOne({
        where: {
            forgot_token: code,
            status: "Pending"
        },
        attributes: ['id', 'created_date']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.insertForgotPass = (db, data) => new Promise((resolve, reject) => {
    db.model('temp_forgot_pass').create(data).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.insertDeletedAccount = (db, data) => new Promise((resolve, reject) => {
    db.model('temp_deleted_account').create(data).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.insertForgotIdData = (db, data) => new Promise((resolve, reject) => {
    db.model('temp_forgot_id').create(data).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.checkForgotData = (db, frogot_token, encrypted_answer) => new Promise((resolve, reject) => {
    db.model('temp_forgot_id').findOne({
        where: {
            forgot_token: frogot_token,
            encrypted_answer: encrypted_answer

        },
        attributes: ['spice_id']
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.checkCityId = (db, city, province) => new Promise((resolve, reject) => {
    let query = {
        where: {
            city_name: city
        },
        attributes: ['spice_id']
    }
    if(province) {
        query = {
            where: {
                city_name: city
            },
            include: [{
                model: db.model('master_state'),
                where: {
                    state_name: province
                },
                attributes: []
            }],
            attributes: ['id', 'city_name', 'state_id']
        }
    }
    db.model('master_city').findOne(query).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.checkBrandPrefRegId = (db, brand_preference_id) => new Promise((resolve, reject) => {
    let query = {
        where: {
            brand_preference_id: brand_preference_id
        },
        include: [{
            model: db.model('master_brand'),
            attributes: ['brand_name', 'registration_cell_id']
        }],
        attributes: ['brand_preference_id', 'brand_preference_name']
    }
    db.model('brand_preferences').findOne(query).then((data) => {
        resolve(data)
    }).catch(reject)
})

// dhany code
exports.getPointPerUser = (db, user_id) => new Promise((resolve, reject) => {
    db.model('user').findOne({
        where: {
            id: user_id
        },
        attributes: ['point']
    }).then((data) => {
        resolve(data.point)
    }).catch(reject)
})

exports.updatePointUser = (db, id, point) => new Promise((resolve, reject) => {
    db.model('user').update({
        point: point,
    },{
        where:{
            id:id
        }
    }).then((data)=>{
        resolve(data)
    }).catch(reject)
})

exports.insertUserPointLog = (db, user_id, action_id, point, type) => new Promise((resolve, reject) => {
    db.model('user_point_log').create({
        user_id : user_id,
        action_id: action_id,
        point: point,
        type: type
    }).then((data)=>{
        resolve(data)
    })
})

exports.checkUserPointLogExists = (db, user_id, action_id) => new Promise((resolve, reject) => {
    db.model('user_point_log').findOne({
        where: {
            user_id: user_id,
            action_id: action_id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getUser = (db, id) => new Promise((resolve, reject) => {
    db.model('user').findOne({
        where: {
            id: id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

let searchToken = (db,token, ip, match_ip = false)=> new Promise((resolve, reject)=>{
    db.model('token').findOne({
        where: 
        {
            token_code: token
        },
        include: [{
            model: db.model('token_profile'),
            attributes: ['user_id','admin_id','last_activity']
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

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

exports.getLoginInfo = async (db, token, ip, match_ip) => {
    let cek = await searchToken(db, token, ip, match_ip)
    if(cek != null) {
        if(cek.token_profile.user_id == null) {
            return null
        }
        let data = await getDataUserById(db, cek.token_profile.user_id)
        data['token_id'] = cek.id
        return data
    }else{
        throw new MyError("Mismatch token",200, 408)
    }
}

// cms dhany
exports.getListHistoryRewards = async (db, req, id) => {
    let data = await req.lib('general').getDataPaging(
        db,
        '(SELECT user_voucher.id, offer.`name`, CASE WHEN user_voucher.`status` = "redeemed" or user_voucher.`status` = "pending" THEN "claimed" WHEN user_voucher.`status` = "available" THEN "redeemed" ELSE user_voucher.`status` END AS status_voucher,  CASE  WHEN user_voucher.`status` = "redeemed" or user_voucher.`status` = "pending" THEN user_voucher.updated_date WHEN user_voucher.`status` = "available" THEN user_voucher.created_date ELSE user_voucher.updated_date END AS date, offer.point  FROM user_voucher JOIN voucher ON voucher.id = user_voucher.voucher_id JOIN batch ON batch.id = voucher.batch_id JOIN offer ON offer.id = batch.offer_id where user_id = "'+id+'") as src',
        'id',
        ['id', 'name', 'status_voucher', 'date', 'point'],
        req.input.post
    )
    return data
}

exports.historyGetpoint = async (db, req, id) => {
    let data = await req.lib('general').getDataPaging(
        db,
        '(SELECT user_point_log.id as id, master_point.action as action, master_point.description as description, user_point_log.point as point, user_point_log.created_date as date FROM user_point_log JOIN master_point ON master_point.id = user_point_log.action_id WHERE user_point_log.user_id = "'+id+'" AND user_point_log.type = "get") as src',
        'id',
        ['id', 'action', 'description', 'point', 'date'],
        req.input.post
    )
    return data
}

//MAULFI : CMS Data
exports.getDatasourceUser =  async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        '(SELECT a.`id`, a.`fullname`, `gender`, a.`spice_id`, if(b.`city_name` IS NULL, "NOT SET", CONCAT(b.`city_name`,"/",c.`state_name`)) AS `city_province`, `valid_phone_number`, `valid_email`, `subscribe`, `registration_date`, `point`  FROM `user` a LEFT JOIN `master_city` b ON  a.`city_id` = b.`id` LEFT JOIN `master_state` c  ON b.`state_id` = c.`id`) as src',
        'id',
        ['id', 'fullname', 'spice_id', 'city_province', 'valid_email', 'valid_phone_number', 'point', 'gender', 'subscribe', 'registration_date'],
        req.input.post
    )
    return data
}

exports.getDatasourceUserDetail = async (db, req, id) => {
    let data = await req.lib('general').get_data_raw_query(
        db,
        'SELECT a.`id`, a.`fullname`, if(`gender` = "F", "Female", "Male") AS `gender`, a.`spice_id`, if(b.`city_name` IS NULL, "NOT SET", CONCAT(b.`city_name`,"/",c.`state_name`)) AS `city_province`, `valid_phone_number`, `valid_email`, `subscribe`, `registration_date`, `point`, e.`interest_name` , GROUP_CONCAT(e.`interest_name` SEPARATOR ",") AS `interest`, GROUP_CONCAT(e.`image_on` SEPARATOR ",") AS `img`, `birthdate`, `register_cell_id`, f.`program`, CONCAT(f.`program`,"/",f.`cell_name`) AS `register_from` FROM `user` a LEFT JOIN `master_city` b ON  a.`city_id` = b.`id` LEFT JOIN `master_state` c  ON b.`state_id` = c.`id` LEFT JOIN `user_interest` d ON a.`id` = d.`user_id` LEFT JOIN `interest_data` e ON d.`interest_id` = e.`id` LEFT JOIN  `cell` f ON a.`register_cell_id` = f.`cell_id` WHERE a.`id` = ' + id + ' GROUP BY a.`id`'
    )
    return data
}

exports.getDatasourceUserInterest = async (db, req, id, base_url) => {
    let data = await req.lib('general').get_data_raw_query(
        db,
        "SELECT CONCAT('" + base_url + "', e.`image_on`) AS `img`, `interest_name` AS `name` FROM `user_interest` d JOIN  `interest_data` e ON d.`interest_id` = e.`id` WHERE d.`user_id` = " + id + " AND e.status = 'Published' AND d.status = 'Published'"
    )
    return data
}

exports.getCityById = (db, id) => new Promise((resolve, reject) => {
    let query = {
        where: {
            id: id
        },
        include: [{
            model: db.model('master_state')
        }],
        attributes: ['id', 'city_name', 'state_id']
    }
    db.model('master_city').findOne(query).then((data) => {
        resolve(data)
    }).catch(reject)
})

//old code
exports.getDetail = (db, id) => new Promise((resolve, reject) => {
    db.model('user').findOne({
        where: {
            id: id
        },
        include: [{
            model: db.model('user_profile'),
            attributes: ['id', 'fullname']
        }],
        attributes: ['id', 'username']
    }).then((data) => {
        resolve(data.point)
    }).catch(reject)
})

exports.getDataUserById = getDataUserById