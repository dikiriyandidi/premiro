'use strict'

exports.adminList = (req, res, next) => {
    (async()=>{
        let role_objs = await req.queries('admin').getPublishedRoles(req.db,[['created_date','ASC']]);
   
        res.render('admin_list',{
            roles: role_objs
        });
    })().catch(next);
}

exports.getAdminList = (req, res, next) => {
    (async()=>{
        let data = await req.queries('admin').getAdminList(req.db,req);
   
        res.json(data);
    })().catch(next);
}

exports.addEditAdmin = (req, res, next) => {
    (async()=>{

        req.input.post.admin_id  = req.input.post.admin_id=="0" ? "" : req.input.post.admin_id
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/setting/admin_list/add_edit",
                options:{
                    checkInputHasId:true,fieldId:"admin_id"
                }
            }],
            add:[{
                url:"/cms/setting/admin_list/add_edit"
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        req.validate(req, ['role','email','fullname', 'status']);
        let data = null;

        let q = req.queries("admin");
        let inputPost = req.input.post
        let adminRole = await q.getAdminRole(req.db,inputPost.admin_id)
        let transactionStatus = false
        let transactionType = false

        delete inputPost[myConfig.csrf_token_name]
        if(adminRole.length==0){
            req.validate(req, ['password']);
            let createAdmin = await q.insertAdmin(req.db,inputPost)
                inputPost.admin_id = createAdmin
            let inserted = await q.insertRole(req.db, inputPost.admin_id, [inputPost.role]);
            transactionStatus = inserted
            transactionType = "insert"
        }else if(adminRole.length==1){
            let adminRoleId = adminRole.map((row,i)=>{
                return row.dataValues.id
            })
                adminRoleId = adminRoleId[0]
            let updatedAdmin = await q.updateAdmin(req.db,inputPost)
            let updated = await q.updateAdminRole(req.db, adminRoleId, {
                role_id:inputPost.role
            });
            transactionStatus = updated
            transactionType = "update"
            
        }else{
            res.error("To many role for admin",400)
            return 
        }

        if(transactionStatus){
            res.success({
                message: `Success ${transactionType} data`
            })
            return
        }
        res.error("Failed to add admin role",400);
        
    })().catch(next)
}

exports.getUserAccess = (req, res, next) => {
    (async()=>{
        let q = req.queries("admin");
        let roles = await q.getPublishedRoles(req.db,[['created_date','ASC']]);
        let menus = await q.getAllMenu(req.db);

        let selectedRole = 0;
        if(req.params.roleId){
            selectedRole = req.params.roleId
        }

        let uacActions = ["view","add","edit","delete","export"];
        uacActions = uacActions.map(row=>{
            return {
                label:row.charAt(0).toUpperCase()+row.substr(1,row.length),
                value:row
            }
        })

        res.render('user_access', {
            roles: roles,
            menus: menus,
            selectedRole:selectedRole,
            uacActions
        });
    })().catch(next);
}

exports.postUserAccess = (req, res, next) => {
    (async()=>{

        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/setting/user_access",
                options:{
                    checkInputHasId:true,fieldId:"role"
                }
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        let q = req.queries("admin")
        let params = ['role']
        req.validate(req, params)
        
        let {
            role:role_id
        } = req.input.post

        let menu = []
        let home_id = 0
        if(req.body.menu != undefined) {
            menu = req.body.menu
        }
        
        if(req.body.home_id != undefined) {
            home_id = req.body.home_id
        }
        
        await q.deleteAccess(req.db, req.body.role, menu)
        await q.deleteAccessAction(req.db, req.body.role)
        let menu_to_insert = await q.getMenusByRoleIdExcluded(req.db, req.body.role, menu)
        
        await q.removeHome(req.db, req.body.role)
        
        await q.insertAccessMenu(req.db, role_id, menu_to_insert, "")
        let menu_post = req.input.post
        let menu_ids = menu_post.menu
        for(let i in menu_ids){

            let menu_id = menu_ids[i]
            let action_granted = menu_post["type_"+menu_id]
            if(action_granted){
                //#region - inser menu access
                await q.bulkInsertMenuAction(req.db,role_id,menu_id,action_granted)
                //#endregion
            }
        }        
        
        await q.setHome(req.db, req.body.role, home_id)
        
        res.success({
            message: 'Success update data',
            roleId:req.body.role
        })
    })().catch(next);
}

exports.getUserAccessByRoleID = (req, res, next) => {
    (async()=>{
        let params = ['role_id']
        req.validate(req, params)
        
        let q = req.queries("admin")
        let {
            role_id
        } = req.input.post

        let menus = await q.getMenusByRoleId(req.db, req.body.role_id)
        let menu_ids = menus.map(row=>row.id)
        let menu_actions = (menu_ids.length==0) ?  [] : await q.getMenuActionByRoleId(req.db, role_id,menu_ids)
        let menu_action_by_role = {}
       
        menu_actions.map(row=>{
            let row_role_id = row.role_id
            let row_menu_id = row.menu_id
            let row_action = row.action_type
            if(menu_action_by_role[row_role_id] == undefined){
                menu_action_by_role[row_role_id] = {}
            }

            if(menu_action_by_role[row_role_id][row_menu_id] == undefined){
                menu_action_by_role[row_role_id][row_menu_id] = []
            }
            menu_action_by_role[row_role_id][row_menu_id].push(row_action)
            return row
        })

        let menu_action_role = (menu_action_by_role[role_id]) ? menu_action_by_role[role_id] : {};
        menus = menus.map(row_menu=>{
            row_menu = row_menu.dataValues
            let menu_id = row_menu.id
            row_menu.is_home = row_menu.role_menus[0].is_home
            row_menu.actions = (menu_action_role[menu_id]) ? menu_action_role[menu_id] : []
            delete row_menu.role_menus
            return row_menu
        })
        res.success({
            data: menus
        })
    })().catch(next);
}

exports.menuAccess  = (req,res,next)=>{
    (async()=>{

        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/setting/menu",
            }],
            add:[{
                url:"/cms/setting/menu",
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }


        let q = req.queries("admin")
        let admin = await q.getAdminByID(req.db,req.session.admin_id)
        let currentRole = false
        if( (admin.admin_roles[0].role==undefined)==false ){
            currentRole = admin.admin_roles[0].role
        }

        let countMenu = await q.countMenu(req.db)
        let menus = await q.getMenuByParent(req.db,0,'All',0)
        let menuIds = menus.map(row=>row.id)
        let menuAccess = await q.isRoleHasMenu(req.db,currentRole.id,menuIds)
        let accessLookup = {}
        menuAccess.map((row,k)=>{
            accessLookup[row.menu_id] = row
        })

        res.render("menu_access",{menus,countMenu,currentRole,accessLookup});

    })().catch(next)
}

exports.managePriority = (req,res,next)=>{
    (async()=>{
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/setting/menu/managepriority",
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        let message = "Succeed"
        let menuTrees = []
        for(let key in req.body.data.menu){
            let row = req.body.data.menu[key]
            menuTrees.push(await req.queries("admin").manageMenuPriority(req.db,row.id,row))
        }

        res.success({
            status:true,
            message: menuTrees
        })
    })().catch(next)
}

exports.manageMenu = (req,res,next)=>{
    (async()=>{
        req.input.post.name = req.input.post.name.trim()
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/setting/menu/managemenu",
                options:{
                    checkInputHasId:true,fieldId:"id"
                }
            }],
            add:[{
                url:"/cms/setting/menu/managemenu",
                options:{
                    checkInputHasId:true,fieldId:"id",fieldValue:""
                }
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        let params = [
            'parent_id',
            {
                name:"name",
                rules:["required"]
            }
        ]
        req.validate(req, params)

        let status = false
        let message = "Failed to create menu"
        let body = req.body
        let latestPriority = await req.queries("admin").getLastMenuPriorityByParentId(req.db,body.parent_id);
        let menu = {
            name    :body.name,
            parent_id:body.parent_id,
            link    : (body.link=="") ? "#" : body.link,
            em_class:body.em_class,
            status  :body.status,
            priority : latestPriority+1
        }

        if(body.id){
            menu.id = body.id
            delete menu.priority
            
            let currentData = await req.queries("admin").getMenuById(req.db,menu.id)
            let hasChild = await req.queries("admin").isMenuHasChild(req.db,menu.id)
            if(hasChild && (currentData.parent_id==body.parent_id)==false ){
                res.error("Failed to update menu. Cannot change parent, menu has children.",400)
                return 
            }
            
            
        }

        let menuId = await req.queries("admin").manageMenu(req.db,menu)
        // check menu save status 
            menuId = (body.id==undefined || body.id=="") ? menuId : body.id;
        
        // update Access menu use body.id or latest menuId
        if(menuId){
            if(body.access_role==0){
                await req.queries("admin").revokeRoleAccessMenu(req.db,body.access_role_id,menuId)
            }else{
                let hasMenu = await req.queries("admin").isRoleHasMenu(req.db,body.access_role_id,menuId)
                if(hasMenu==false){
                    await req.queries("admin").insertAccess(req.db,body.access_role_id,[menuId])
                }
            }
        }

        if(menuId){
            status = true
            message = "Success to create menu"
            if( (menu.id==undefined)==false ){
                status = true
                message = "Success to update menu"
            }

            res.success({
                status:status,
                message:message
            })
            return
        }
        res.error("Failed to create menu",400)

    })().catch(next)
}

exports.roleListView = (req, res, next) => {
    (async () => {
        // - render to view
        res.render('role_list')
    })().catch(next)
}

exports.roleListDatatable = (req, res, next) => {
    (async () => {
        let data = await req.queries('setting').roleListDatatable(req.db, req)

        if(data != null) {
            res.json(data)
        }else{
            res.error("Data not found",200)
        }
    })().catch(next)
}

exports.roleListManage = (req, res, next) => {
    (async () => {
        // - validate request data value
        req.input.post.name = req.input.post.name.trim()
        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            edit:[{
                url:"/cms/setting/role_list/manage",
                options:{
                    checkInputHasId:true,fieldId:"role_id"
                }
            }],
            add:[{
                url:"/cms/setting/role_list/manage",
                options:{
                    checkInputHasId:true,fieldId:"role_id",fieldValue:""
                }
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        let param = [
            {
                name: 'name',
                rules:[
                    'required'
                ]
            }, {
                name: 'status',
                rules:[
                    'required'
                ]
            }
        ]
        req.validate(req, param)

        let inputPost = req.input.post
        if(inputPost.status=="Unpublished" && inputPost.role_id!="" && inputPost.role_id!=0 ){
            let adminUseRole = await req.queries("setting").countAdminByRoleID(req.db,inputPost.role_id)
            if(adminUseRole>0){
                res.error('Role is used. cannot be unpublished.',400)
                return
            }
        }

        // - check duplicate entry
        let is_duplicate = await req.queries('setting').isDuplicateRole(req.db, req.body)
        if(is_duplicate > 0) {
            res.error('Duplicate Entry',400)
            return
        }

        // - save to database
        req.queries('setting').roleListManage(req.db, req.body)

        // - return response based on role_id
        let message = 'Success insert data'
        if(req.body.role_id != null && req.body.role_id != '') {
            message = 'Success update data'
        }

        res.success({
            message: message
        })
    })().catch(next)
}

exports.roleListDestroy = (req, res, next) => {
    (async () => {

        let uacAction = await res._asyncUacActionFor(req.originalUrl,{
            delete:[{
                url:"/cms/setting/role_list/destroy",
                options:{
                    checkInputHasId:true,fieldId:"id"
                }
            }],
        })
        if(!uacAction.status){
            return res._userActionRespond()
        }

        // - validate request data value
        let param = [
            {
                name: 'id',
                rules:[
                    'required'
                ]
            }
        ]
        req.validate(req, param)

        let inputPost = req.input.post
        if(inputPost.id!="" && inputPost.id!=0 ){
            let adminUseRole = await req.queries("setting").countAdminByRoleID(req.db,inputPost.id)
            if(adminUseRole>0){
                res.error('Role is used. cannot be deleted.',400)
                return
            }
        }

        // - save to database
        req.queries('setting').roleListDestroy(req.db, req.body)

        res.success({
            message: 'Success delete data'
        })
    })().catch(next)
}
