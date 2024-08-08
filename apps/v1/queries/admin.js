'use strict'
let libpw = require('../libs/password')
let date = require('../libs/timehelper')
let op = Sequelize.Op;

exports.getAdminList = (db, req) =>new Promise ((resolve, reject)=>{ 
    (async() =>{
        let data = await req.lib('general').getDataPaging(
            db, 
            `(
                select distinct a.id,c.name as role,
                b.role_id as role_ids, a.email username, a.fullname, 
                a.status 
                from admin a 
                left join admin_role b ON a.id = b.admin_id 
                left join role c ON b.role_id = c.id 
                order by a.id
            ) as src`,
            'id', ['id','role','username','fullname','status','role_ids'], 
            req.body
        );
        resolve(data);
    })()
})

exports.getAdminByEmail = (db, email) => new Promise(
    (resolve, reject) => 
    {
        db.model('admin').findOne({
            where: {
                status: "Active",
                email: email
            },
            include: [
                {
                    model: db.model('admin_role'),
                    include: [
                        {
                            model: db.model('role'),
                        }
                    ]
                }
            ]
        }).then((data)=>{
            resolve(data)
        })
    }
)

exports.insertAdmin = (db, data) => new Promise(
    (resolve, reject) =>
    {
        (async()=>{
            db.model('admin').create({
                email: data.email,
                fullname: data.fullname,
                password: data.password,
                created_date: data.created_date,
                status: data.status
            }).then((data)=>{
                resolve(data.id);
            });
        })().catch(reject);
    }
)

exports.updateAdmin = (db, data)=> new Promise(
    (resolve, reject) => {
        let indvHooks = false
        let obj = {
            email: data.email,
            fullname: data.fullname,
            // password: data.password,
            status: data.status,
        }
        if(data.password != ''){
            obj.password = data.password
            indvHooks = true
        }

        db.model('admin').update( obj, {
            where: { id: data.admin_id },
            individualHooks: indvHooks, 
        }).then((data)=>{
            resolve(data);
        });
    }
)

exports.getAdminByID = (db, id) => new Promise(
    (resolve, reject) => 
    {
        db.model('admin').findOne({
            where: {
                status: "Active",
                id: id
            },
            include: [
                {
                    model: db.model('admin_role'),
                    include: [
                        {
                            model: db.model('role'),
                        }
                    ]
                }
            ]
        }).then((data)=>{
            resolve(data)
        });
    }
)

let getAllMenu = (db, parent_id = 0) => new Promise(
    (resolve, reject) => {
        
        db.model('menu').findAll({
            where: {
                parent_id: parent_id,
                status:"Published"
            },
            order:[
                ['priority', 'ASC']
            ]
        }).then((data)=>{
            (async()=>{
                let res = [];
                for(let i in data){
                    let obj = data[i].dataValues;
                    let child = await getAllMenu(db, obj.id);
                    if(child.length > 0){
                        obj.child = [];
                        for(let j in child){
                            let obj_c = child[j];
                            obj.child.push(obj_c);
                        }
                    }

                    res.push(obj);
                }
                resolve(res);
            })().catch(reject);
        })
        
    }
)

exports.getAllMenu = (db, parent_id = 0) => new Promise(
    (resolve, reject) => {
        (async() => {
            let data = await getAllMenu(db, parent_id);
            resolve(data);
        })().catch(reject);
})


let getUserMenu = (db, admin_id, url, level = 0, parent_id = 0) => new Promise(
    (resolve, reject) => {
        db.model('menu').findAll({
            where: {
                parent_id: parent_id,
                status:'Published'
            },
            order:[
                ['priority', 'ASC']
            ],
            include: [{
                model: db.model('role_menu'),
                include: [{
                    model: db.model('role'),
                    include: [{
                        model: db.model('admin_role'),
                        include: [{
                            model: db.model('admin'),
                            where: {
                                id: admin_id
                            },
                        }],
                        required: true
                    }],
                    required: true
                }],
                required: true
            }]
        }).then((data)=>{
            (async() => {
                let res = [];
                for(let i in data){
                    let obj = data[i].dataValues;
                    obj.active = false;
                    obj.collapse = true;

                    let regexp = new RegExp(obj.link + "*",'gi');
                    if(url == '/cms/' && obj.link == '/cms/')
                        obj.active = true;
                    else if(obj.link != '#' && obj.link != '/cms/'){
                        if(regexp.test(url))
                            obj.active = true;
                    }
                    
                    let child = await getUserMenu(db, admin_id, url, level+1, obj.id);
                    obj.level = level;
                    if(child.length > 0){
                        obj.child = [];
                        for(let j in child){
                            let obj_c = child[j];
                            if(obj_c.active)
                                obj.collapse = false;
                            obj.child.push(obj_c);
                        }
                    }
                    delete obj.role_menus;
                    res.push(obj);
                }
                resolve(res);
            })().catch(reject);
        })
    }
)

exports.getUserMenu = (db, admin_id, url) => new Promise(
    (resolve, reject) => {
        (async() => {
            let data = await getUserMenu(db, admin_id, url);
            resolve(data);
        })().catch(reject)
})

exports.getMenusByRoleId = (db, role_id) => new Promise((resolve, reject)=>{
    db.model('menu').findAll({
        include: [{
            model: db.model('role_menu'),
            where: {
                role_id: role_id
            }
        }]
    }).then((data)=>{
        resolve(data)
    })
})

exports.getHomePage = (db, role_id) =>new Promise((resolve, reject)=>{
    let res = '/cms/'
    db.model('role_menu').findOne({
        where:{
            role_id:role_id,
            is_home:1
        },
        include:[
            {
                model: db.model('menu'),
            }
        ],
        order: [
            ['is_home', 'DESC'],
            ['menu_id', 'ASC']
        ]
    }).then((data)=>{
        let res = "#"
        if(data){
            res = data.menu.link
        }
        resolve(res)
    })
})

exports.deleteAccess = (db, role_id, menu) => new Promise((resolve, reject)=>{
    db.model('role_menu').destroy({
        where:{
            id: {
                [op.notIn]: menu
            },
            role_id: role_id
        }
    }).then((data)=>{
        resolve(data)
    })
})

exports.getMenusByRoleIdExcluded = (db, role_id, exclude) => new Promise((resolve, reject)=>{
    db.model('menu').findAll({
        include: [{
            model: db.model('role_menu'),
            where: {
                role_id: role_id
            }
        }]
    }).then((data)=>{
        let res = []
        for(let j in exclude){
            let found = false
            for(let i in data){
                let obj = data[i].dataValues
                
                if(obj.id == exclude[j]){
                    found = true
                    break
                }
            }

            if(!found)
                res.push(exclude[j])
        }
        resolve(res)
    })
})

exports.removeHome = (db, role_id) => new Promise((resolve, reject)=>{
    db.model('role_menu').update({
        is_home: false
    },{
        where:{
            role_id: role_id
        }
    }).then((data)=>{
        resolve(data)
    })
})

exports.insertAccess = (db, role_id, menu, home_id) => new Promise((resolve, reject)=>{
    let data = []
    for(let i in menu){
        let obj = {
            role_id : role_id,
            menu_id : menu[i],
            is_home: false
        }
        data.push(obj)
    }
    db.model('role_menu').bulkCreate(data).then((data)=>{
        resolve(data)
    })
}) 

exports.insertRole = (db, admin_id, role) => new Promise((resolve, reject) => {
    let data = []
    for(let i in role){
        let obj = {
            admin_id : admin_id,
            role_id : role[i]
        }
        data.push(obj)
    }
    db.model('admin_role').bulkCreate(data).then((data)=>{
        resolve(data)
    })
})

exports.setHome = (db, role_id, menu_id) => new Promise((resolve, reject)=>{
    db.model('role_menu').update({
        is_home: true
    },{
        where:{
            role_id: role_id,
            menu_id: menu_id
        }
    }).then((data)=>{
        resolve(data)
    })
})

exports.login = (db, email, password,encrypt_password) => new Promise((resolve, reject)=>{
    let user_data =db.model('admin').findOne({
        where: {
            status: "Active",
            email: email
        }
    })

    db.model('admin').findOne({
        where:{
            email: email,
            password: libpw.checkPasswordCms(password,encrypt_password),
            status : 'Active'
        }
    }).then((data)=>{
        resolve(data);
    })
})
exports.getPublishedRoles = (db,order=false) => new Promise((resolve, reject) => {
    order = (order) ? order : [["name","ASC"]]
    db.model('role').findAll({
        where: {
            status: 'Published'
        },
        order: order
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.lastLogin = (db, email,req) => new Promise((resolve, reject)=>{
    let now = date.formatYmdHis()

    db.model('admin').update({
        last_login:now,
    },{
        where:{
            email: email
        }
    }).then((data)=>{
        resolve(data)
    })
})

exports.getAllowedMenu = (db, admin_id) => new Promise((resolve, reject) => {
    db.model('admin_role').belongsTo(db.model('role_menu'), {foreignKey: 'role_id', targetKey: 'role_id'});
    db.model('role_menu').hasMany(db.model('admin_role'), {foreignKey: 'role_id'});

    db.model('role_menu').belongsTo(db.model('menu'), {foreignKey: 'menu_id',});
    db.model('menu').hasMany(db.model('role_menu'), {foreignKey: 'menu_id'});

    db.model('admin_role').findAll({
        where: {
            admin_id: admin_id
        },
        include:[{
            model:db.model('role_menu'),
            required:true,
            include:[{
                model:db.model('menu'),
                required:true,
                where: {
                    link: {
                        [op.notLike]: '#'
                    },
                    status: 'Published'
                },
            }],
        }],
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

let menuCollection = []
let getMenuByParent = (db,parent_id=0,status="Published",deep=0,rootPath='#') => new Promise(
    (resolve,reject)=>{
        if(deep==0){
            menuCollection = []
            rootPath='#'
        }
        if(status=="All"){
            status = ["Published","Unpublished"]
        }
        db.model('menu').findAll({
            where: {
                parent_id: parent_id,
                status:status
            },
            order: [['priority', 'DESC']],
        }).then((data)=>{
            (async()=>{
                for(let i=data.length-1;i>=0;i--){
                    let row = data[i]
                    let hasChild = await isMenuHasChild(db,row.id,status)
                    let currentRootPath = `${rootPath}_${row.id}`
                    
                    row.dataValues.treeText = row.name.padStart(row.name.length+deep+1,"~")
                    row.dataValues.hasChild = hasChild
                    row.dataValues.deep = 20*parseInt(deep)+1
                    row.dataValues.rootPath = currentRootPath 
                    menuCollection.push(row)

                    if(hasChild){
                       await getMenuByParent(db,row.id,status,deep+1,currentRootPath)
                    }
                }
                resolve(menuCollection)
            })().catch(reject)
        }).catch(reject)
    }
)
exports.getMenuByParent = getMenuByParent;

let isMenuHasChild = (db,menu_id='',status="Published")=> new Promise(
    (resolve,reject)=>{
        db.model('menu').count({
            where:{
                parent_id:menu_id,
                status:status
            },
            order: [['priority', 'DESC']]
        }).then((data)=>{
            resolve(data)
        }).catch(reject)
    }
)
exports.isMenuHasChild = isMenuHasChild;


exports.countMenu = (db,status="Published")=> new Promise(
    (resolve,reject)=>{
        db.model('menu').count({
            where:{
                status:status
            }
        }).then((data)=>{
            resolve(data)
        }).catch(reject)
    }
)

exports.manageMenuPriority = (db,id,data)=> new Promise(
    (resolve,reject)=>{
        db.model("menu").update(data,{
            where:{id:id}
        }).then((data)=>{
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
    }
)

exports.getLastMenuPriorityByParentId = (db,parent_id)=> new Promise(
    (resolve,reject)=>{
        db.model("menu").findOne({
            where:{
                parent_id:parent_id
            },
            order:[['priority','DESC']]
        }).then((data)=>{
            let dataPriority = 0;
            if(data){
                dataPriority = data.priority
            }
            resolve(dataPriority)
        }).catch(err=>reject(err))
    }
)

exports.manageMenu = (db,menu)=> new Promise(
    (resolve,reject)=>{
        if(menu.id){
            db.model("menu")
            .update(menu,{
                where:{
                    id:menu.id
                }
            })
            .then((data)=>{
                resolve(data)
            }).catch(err=>reject(err))
            return 
        }

        db.model("menu")
            .create(menu)
            .then((data)=>{
                resolve(data.id)
            }).catch(err=>reject(err))
    }
)

exports.getMenuById = (db,menuId)=> new Promise(
    (resolve,reject)=>{
        db.model("menu").findOne({where:{
            id:menuId
        }}).then(data=>resolve(data))
        .catch(err=>reject(err))
    }
)

exports.isRoleHasMenu = (db,roleId,menuId)=> new Promise(
    (resolve,reject)=>{
        db.model('role_menu').findAll({
            where:{
                menu_id:menuId,
                role_id:roleId
            }
        }).then(data=>resolve(data))
        .catch(err=>reject(err))

    }
)

exports.revokeRoleAccessMenu = (db,roleId,menuId) => new Promise(
    (resolve,reject)=>{
        db.model('role_menu').destroy({
            where:{
                menu_id: menuId,
                role_id: roleId
            }
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
)

exports.changePassword = (db, data, id) => new Promise((resolve, reject) => {
    db.model('admin').update(data, {
        where: {id: id},
        individualHooks: true
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getAdminRole = (db,adminId=false) => new Promise((resolve,reject)=>{
    (async()=>{
        db.model('admin_role').findAll({
            where:{admin_id:adminId}
        }).then((data)=>{
            resolve(data)
        }).catch(reject)
    })()
})

exports.updateAdminRole = (db,adminRoleId=false,values={}) => new Promise((resolve,reject)=>{
    (async()=>{
        let updated_at = [date.formatYmdDash(new Date()),date.formatHis(new Date())].join(" ")
        values.updated_at = updated_at
        console.log(values)
        
        db.model('admin_role').update(values,{
            where:{id:adminRoleId}
        }).then((data)=>{
            resolve(data)
        }).catch(reject)
    })()
})

exports.getLoginLog = (db, email, time_start, time_end) => new Promise((resolve, reject) => {
    (async () => {
        db.model('admin_login_log').findAll({
            where: {
                email : email ? email.substring(0, 250) : "",
                status: 'Failed',
                created_date:{
                    [op.gte]:time_start,
                    [op.lte]:time_end
                },
            }
        }).then((data) => {
            resolve(data);
        });
    })().catch(reject);
})

exports.getLastLoginAttempt = (db, email, time_start, time_end) => new Promise((resolve, reject) => {
    (async () => {
        db.model('admin_login_log').findOne({
            where: {
                email : email ? email.substring(0, 250) : "",
                status: 'Failed',
            },
            order: [
                ['id', 'desc']
            ],
            attributes: ['created_date'],
        }).then((data) => {
            resolve(data);
        });
    })().catch(reject);
})

exports.insertLoginLog = (db, data) => new Promise((resolve, reject) => {
    (async () => {
        let value = {
            email: data.email ? data.email.substring(0, 250) : "",
            status: data.status
        }

        db.model('admin_login_log').create(value).then((data) => {
            resolve(data)
        })
    })().catch(reject);
})

exports.deleteAccessAction = (db, role_id) => new Promise((resolve, reject) => {
    db.model('role_menu_action').destroy({
        where:{
            role_id: role_id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.insertAccessMenu = (db, role_id, menu, type) => new Promise((resolve, reject) => {
    let role_menu_row = menu = menu.map(menu_id=>{
        return {
            role_id : role_id,
            menu_id : menu_id,
            type: type
        }
    })
    db.model('role_menu').bulkCreate(role_menu_row).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.bulkInsertMenuAction = (db, role_id=0,menu_id, action_granted=[]) => new Promise(
    (resolve, reject) => {
        let data = action_granted.map(function(rowAction){
            return {
                role_id,
                menu_id,
                action_type: (rowAction) ? rowAction.toLowerCase() : ""
            }
        })
        db.model('role_menu_action').bulkCreate(data).then((data) => {
            resolve(data)
        }).catch(reject)
    }
)

exports.getMenuActionByRoleId = (db, role_id=[],menu_ids=[]) => new Promise(
    async (resolve, reject) => {
        let queryString = `SELECT * 
        FROM role_menu_actions rmna
        INNER JOIN menu m ON m.id = rmna.menu_id
        WHERE rmna.role_id IN (:param_role_id) 
        AND rmna.menu_id IN (:param_menu_id)`
        let menuActions = await db.getConnection().query(queryString, 
            {
                replacements:{
                    param_role_id:role_id,
                    param_menu_id:menu_ids
                },
                type: Sequelize.QueryTypes.SELECT
            }
        )
        resolve(menuActions)
    }
        
)

exports.getRoleIds = (db, id) => new Promise((resolve, reject) => {
    if(!id){
        resolve(null)
        return
    }
    db.model('admin_role').findAll({
        where: {
            admin_id:id,
        },
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})