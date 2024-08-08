'use strict'
let op = Sequelize.Op;
/**

 * GET EVENT DATATABLE
 */
exports.eventDatatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT e.id, e.string_id, e.title, e.featured_image, e.startdate, e.enddate, e.status, ec.city_name as city FROM event e left join event_city ec on ec.id = e.city_id where e.status not like 'Trash') as SRC",
        'id',
        ['id', 'string_id', 'title', 'city', 'startdate', 'enddate', 'featured_image', 'status'],
        req.input.post
    )
    return data
}

/**

 * GET EVENT DETAIL BY STRING ID
 */
exports.getEventByStringId = (db, string_id) => new Promise((resolve, reject) => {
    db.model('event').belongsTo(db.model('event_city'), {foreignKey: 'city_id'});
    db.model('event_city').hasMany(db.model('event'), {foreignKey: 'city_id'});

    db.model('event').findOne({
        where: {
            string_id: string_id
        },
        include:[{
            model:db.model('event_city'),
            attributes: ['city_name'],
            required:true
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**
 * Get Event
 */
 exports.getEvent = async (db, limit, offset) => {
    db.model('event').belongsTo(db.model('event_city'), {foreignKey: 'city_id'});
    db.model('event_city').hasMany(db.model('event'), {foreignKey: 'city_id'});

    let total = await db.model('event').count({
        where: {
            status: 'Published'
        }
    })
    let event = await db.model('event').findAll({
        attributes: ['id', 'string_id', 'title', 'startdate', 'enddate', 'featured_image', 'status'],
        where: {
            status: 'Published'
        },
        include:[{
            model:db.model('event_city'),
            attributes: ['city_name'],
            required:true
        }],
        limit,
        offset
    })

    return {
        total,
        event
    }
}

/**

 * GET EVENT DETAIL BY ID
 */
 exports.eventDetail = (db, id) => new Promise((resolve, reject) => {
    db.model('event').belongsTo(db.model('event_city'), {foreignKey: 'city_id'});
    db.model('event_city').hasMany(db.model('event'), {foreignKey: 'city_id'});

    db.model('event').findOne({
        where: {
            id: id
        },
        include:[{
            model:db.model('event_city'),
            attributes: ['city_name'],
            required:true
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**
 * Get City
 */
 exports.getCity = async (db, limit, offset) => {
    let total = await db.model('event_city').count({
        where: {
            status: 'Published'
        }
    })
    let city = await db.model('event_city').findAll({
        attributes: ['id', 'city_name', 'description', 'status'],
        where: {
            status: 'Published'
        },
        limit,
        offset
    })

    return {
        total,
        city
    }
}

/**

 * GET CITY DETAIL BY ID
 */
 exports.cityDetail = (db, id) => new Promise((resolve, reject) => {
    db.model('event_city').findOne({
        attributes: ['id', 'city_name', 'description', 'status'],
        where: {
            id: id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**

 * SAVE EVENT TO DATABASE
 */
exports.eventManage = (db, post) => new Promise((resolve, reject) => {
    let values = {
        title: post.title,
        city_id: post.city_id,
        venue: post.venue,
        address: post.address,
        event_description: post.description,
        status: post.status,
        is_featured: (post.is_featured == '' ? 'FALSE' : post.is_featured),
        startdate: post.startdate + ' ' + post.starttime,
        enddate: post.enddate + ' ' + post.endtime,
        publish_date: post.publish_date
    }

    if(post.id == null || post.id == '') {
        values.string_id = post.string_id
        values.featured_image = post.featured_image

        db.model('event').create(values).then((data) => {
            resolve(data)
        }).catch(reject)
    }else{
        if(post.featured_image !== '') {
            values.featured_image = post.featured_image
        }

        db.model('event').update(values, {
            where: {id: post.id}
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
})

/**

 * UPDATE EVENT STATUS TO TRASH
 */
exports.eventDestroy = (db, id) => new Promise((resolve, reject) => {
    db.model('event').update({
        status: 'Trash'
    }, {
        where: {id: id}
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**

 * GET EVENT CITY DATATABLE
 */
exports.cityDatatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT * FROM event_city where status not like 'Trash') as SRC",
        'id',
        ['id', 'city_name', 'description', 'status'],
        req.input.post
    )
    return data
}

/**

 * GET EVENT DETAIL
 */
exports.isCityExist = (db, post) => new Promise((resolve, reject) => {
    let where = {
        city_name : post.city_name.trim(),
        status: {
            [op.notLike]: 'Trash'
        }
    }

    if(post.id != null && post.id != '') {
        where.id = {
            [op.ne] : post.id
        }
    }

    db.model('event_city').count({where}).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**

 * SAVE EVENT CITY TO DATABASE
 */
exports.eventCityManage = (db, post) => new Promise((resolve, reject) => {
    let values = {
        city_name: post.city_name,
        description: post.description
    }

    if(post.id == null || post.id == '') {
        db.model('event_city').create(values).then((data) => {
            resolve(data)
        }).catch(reject)
    }else{
        db.model('event_city').update(values, {
            where: {id: post.id}
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
})

/**

 * UPDATE EVENT CITY STATUS TO TRASH
 */
exports.eventCityDestroy = (db, id) => new Promise((resolve, reject) => {
    db.model('event_city').update({
        status: 'Trash'
    }, {
        where: {id: id}
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})