'use strict';

exports.index = (req, res, next) => {
    (async () => {
        let uq = req.queries("admin");
        if (req.session != undefined && req.session.admin_id != undefined && req.session.admin_id != 0) {
            let admin = await uq.getAdminByID(req.db, req.session.admin_id);
            let adminRole = (admin.admin_roles[0].role_id)
            let home_page = await uq.getHomePage(req.db,adminRole)
            if (home_page === "#") {
                res.render('index', {});
            } else {
                res.redirect(home_page);
            }
        } else
            res.redirect(myConfig.login_admin);
    })().catch(next);
}

exports.login = (req, res, next) => {
    res.render('login', {
        sitekey: myConfig.sitekey
    });
}

exports.logout = (req, res, next) => {
    req.session.admin_id = ""
    res.redirect("/cms/login")
    
    // res.render('login', {
    //     sitekey: myConfig.sitekey
    // });
}

exports.landing = (req, res, next) => {
    res.render('index', {});
}

exports.home = (req, res, next) => {
    res.render('index', {});
}

exports.loginPost = (req, res, next) => {
    (async()=>{
        let param = [{
            name: 'email',
            rules: [
                'required', 'email'
            ]
        }, {
            name: 'password',
            rules: [
                'required'
            ],
        }]
        if(myConfig.recaptcha){
            let res_google = await req.lib("captcha").checkGRecaptcha(req)

            if(!res_google.success) {
                res.error("Please provide correct captcha",400)
                return
            }
        }

        req.validate(req, param);
        //-- locked email on 5 attempt fail.
        let values = req.body
        let time_end = await req.queries("admin").getLastLoginAttempt(req.db, req.body.email);

        if (time_end) {
            let now = new Date();
            let last_attempt_ = new Date(time_end.created_date);
            let time_start = last_attempt_.getTime() - 30 * 60 * 1000;
            let check_last_login = await req.queries("admin").getLoginLog(req.db, req.body.email, time_start, now);
            let remanining_time = Math.ceil(30 - ((now.getTime() - last_attempt_.getTime()) / (60 * 1000) ));

            if (check_last_login.length >= 5 && remanining_time > 0 ) {
                res.error("Too many login attempt detected. Please wait " + remanining_time + " minutes.",200)
                return
            }
        }
        //--
        let user_data = await req.queries('admin').getAdminByEmail(req.db, req.body.email); 
        let admin = null
        let check = null

        if(user_data){
            check = await req.lib("password").checkPasswordCms(user_data.password,req.body.password)
        }

        if(check === false || user_data==null) {
            values.status = "Failed";
            req.queries('admin').insertLoginLog(req.db, values);
            res.error("Invalid combination username and password!",400);
        }else if(user_data && check){
            req.session.admin_id = user_data.id;
            req.session.username = user_data.email
            let data = {
                message: 'Success Login',
                home_url: '/cms/',
            };
            values.status = "Success";

            //regenerate session after login -- Session Fixation
            let tempSession = req.session;

            await req.session.regenerate((err) => {
                Object.assign(req.session, tempSession);
            });

            await req.queries('admin').insertLoginLog(req.db, values);
            await req.queries('admin').lastLogin(req.db, req.body.email)

            await sleep(1000)

            res.success(data);
        }

    })().catch(next);
}

exports.changeMyPassword = (req, res, next) => {
    (async () => {
        let userAdmin = await req.queries("admin").getAdminByID(req.db,req.session.admin_id)
        let homePage = await req.queries("admin").getHomePage(req.db, req.session.admin_id);
        let username = userAdmin.email
        let home_page = (homePage=="" || homePage=="#") ? "/cms/" : homePage;

        res.render('change_my_password', {
            username: username,
            home_page : home_page
        })
    })().catch(next)
}

exports.postChangePassword = (req, res, next) => {
    (async () => {
        let q = req.queries("admin")
        let params = [
            'old_password', {
                name: 'new_password',
                rules:['required', 'checkpass']
            }, {
                name: 'confirm_password',
                rules: ['required', 'min_length:8', 'checkconfirmpass:' + req.body.new_password]
            }
        ]
        req.validate(req, params)

        let genlib = req.lib("password")
        let user_data = await q.getAdminByID(req.db, req.session.admin_id)

        if(user_data == null) {
            res.error("Invalid Operation.!",403)
        } else if(genlib.checkPasswordCms(user_data.password, req.body.old_password)) {
            q.changePassword(req.db, {password:req.body.new_password}, req.session.admin_id)
            res.success({
                message: 'Success Change Password!'
            })
        }else{
            res.error("Invalid Old Password",400)
        }
    })().catch(next)
}
let sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}