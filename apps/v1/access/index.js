'use strict'

exports.check = (db, req) => new Promise((resolve, reject)=>{
    (async() => {
        let res = true;
        let url = req.url;
        let admin_id = req.session.admin_id;

        let allowed_menu = await req.queries("admin").getAllowedMenu(req.db, admin_id)
        
        let getPath = req.url
        let granted_access = allowed_menu.some(function (element) {
            // console.log(getPath,getPath.indexOf(element.role_menu.menu.link))
            return getPath.indexOf(element.role_menu.menu.link) >= 0

        });
        
        if(["/cms","/cms/","/cms/login","/cms/logout","/cms/change_password"].indexOf(getPath)>-1){
            res = true;
        }
        else if(allowed_menu === null || granted_access === false) {
            res = false
        }
        else {
            res = true;
        }

        // if(menu != undefined) {

        // console.log("check url ... ",url, admin_id);

        //query check ke table


        //req.session.admin_id => 
        // let regexp = new RegExp('/cms/admin' + "*",'gi');
        // if(req.session.admin_id == 1 && regexp.test(req.url))
        //     res = false;
        // if(res)
        //     console.log("boleh lewat");
        // else
        //     console.log("ga boleh lewat");
        resolve(res);
    })();
})