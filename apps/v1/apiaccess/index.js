'use strict'

exports.check = (db, req) => new Promise((resolve, reject)=>{
    (async()=>{
        let res = true;
        let url = req.url;
        console.log("api access", url);
        if(url == '/api/admin/list'){
            let tokenprofile = await req.queries('token').gettokenprofile(req.db, req.token);
            console.log("token profile", tokenprofile);
            if(tokenprofile.length > 0){
                if(tokenprofile[0].user_id == null || tokenprofile[0].user_id == 0)
                    res = false;
            }
            else
                res = false;
        }
        resolve(res);
    })()
})