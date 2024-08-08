'use strict'

exports.get = (req, res, next) => {
    (async() => {
        let param = ['name','secret_key'];
        req.validate(req, param);

        //check apps name and secret_key
        let apps = await req.queries('apps').checkApps(req.db, req.body.name, req.body.secret_key);
        if(apps == null){
            res.error("Invalid authorization", 401);
        }
        else{
            let device_id = '';
            let device_type = '';
            
            if(req.body != undefined && req.body.device_id != undefined && req.body.device_type != undefined) {
                device_id = req.body.device_id;
                device_type = req.body.device_type;
            }
            
            let token_query = req.queries('token');
            //check if device has token or not
            let token_search = await token_query.getbydevice(req.db, apps.id, device_id);
            
            let token = '';
            if(token_search == null)
                token = await token_query.generate(req.db, apps.id, device_id, device_type);
            else
                token = await token_query.regenerate(req.db, token_search, apps.id, device_id, device_type);
            res.success({token: token});
        }
    })().catch(next);
}

exports.refresh = (req, res, next) => {
    
    (async() => {
        let param = ['refresh_token', 'token'];
        req.validate(req, param);

        let device_id = '';
        
        if(req.body != undefined && req.body.device_id != undefined) {
            device_id = req.body.device_id;
        }
        let token = req.body.token;
        let refresh_token = req.body.refresh_token;
        let token_query = req.queries('token');
        let cek = await token_query.refresh(req.db, refresh_token, token, device_id, myConfig.token_match_ip);
        let res_data = {
            created_date: cek.created_date,
            expired_date: cek.expired_date,
            id: cek.id,
            token_code: cek.token_code,
            refresh_token: cek.refresh_token,
            device_id: cek.device_id,
            device_type: cek.device_type
        };
        res.success({token: res_data});
    })().catch(next);
}

//[need to be disabled at production, except want to provide token checker]
exports.check = (req, res, next) =>{
    (async()=>{
        let param = ['token'];
        req.validate(req, param);
        
        let token = req.body.token;
        let token_query = req.queries('token');
        let cek = await token_query.check(req.db, token, req.ip, myConfig.token_match_ip);
        if(cek == null)
            res.error("Invalid credential", 407);
        else
            res.success({data: cek});
    })().catch(next)
}