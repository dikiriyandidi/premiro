'use strict'
let op = Sequelize.Op;

exports.countAdminByRoleID = (db,roleId=0)=>new Promise((resolve,reject)=>{
    (async()=>{
        db.model("admin_role").count({
            where:{role_id:roleId}
        }).then((data)=>{
            resolve(data)
        }).catch(reject)
    })()
})

exports.roleListDatatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT id, name, status FROM role where status not like 'Trashed') as SRC",
        'id',
        ['id', 'name', 'status'],
        req.input.post
    )
    return data
}

exports.isDuplicateRole = (db, post) => new Promise((resolve, reject) => {
    let where = {
        name : post.name.trim(),
        status: {
            [op.notLike]: 'Trash'
        }
    }

    if(post.role_id != null && post.role_id != '') {
        where.id = {
            [op.ne] : post.role_id
        }
    }

    db.model('role').count({where}).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.roleListManage = (db, post) => new Promise((resolve, reject) => {
    let values = {
        name: post.name,
        status: post.status
    }

    if(post.role_id == null || post.role_id == '') {
        values.updated_date = (values.updated_date) ? values.updated_date : new Date()
        db.model('role').create(values).then((data) => {
            resolve(data)
        })
    }else{
        values.updated_date = (values.updated_date) ? values.updated_date : new Date()
        db.model('role').update(values, {
            where: {id: post.role_id}
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
})

exports.roleListDestroy = (db, post) => new Promise((resolve, reject) => {
    db.model('role').update({
        status: 'Trashed'
    }, {
        where: {id: id}
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})