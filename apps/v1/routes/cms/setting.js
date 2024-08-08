'use strict';

module.exports = (app, router) => {
    const setting = app.controller('cms/setting')
    router.get('/admin_list', setting.adminList)
    router.post('/admin_list/add_edit', setting.addEditAdmin)
    router.all('/admin_list/get', setting.getAdminList)

    router.get('/user_access', setting.getUserAccess)
    router.get('/user_access/:roleId', setting.getUserAccess)
    router.post('/user_access', setting.postUserAccess)
    router.post('/user_access/get_user_access_by_role_id', setting.getUserAccessByRoleID)

    router.get('/role_list', setting.roleListView)
    router.post('/role_list', setting.roleListDatatable)
    router.post('/role_list/manage', setting.roleListManage)
    router.delete('/role_list/destroy/:id', setting.roleListDestroy)
 
    router.get('/menu', setting.menuAccess)
    router.get('/menu/:type/show', setting.menuAccess)
    router.post('/menu/managepriority', setting.managePriority)
    router.post('/menu/managemenu', setting.manageMenu)

}