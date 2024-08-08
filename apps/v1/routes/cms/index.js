'use strict';


module.exports = (app, router) => {
    const controller = app.controller('cms/login');
    router.get('/', controller.index);
    router.get('/home', controller.home);
    router.get('/login', controller.login);
    router.get('/logout', controller.logout);
    router.post('/login', controller.loginPost);
    router.get('/change_password', controller.changeMyPassword);
    router.post('/change_password', controller.postChangePassword);
    router.use('/setting', app.route('setting','cms'));
    router.use('/article', app.route('article','cms'));
    router.use('/event', app.route('event','cms'));
    router.use('/upload_image', app.route('upload_image','cms'));
    router.use('/voucher', app.route('voucher','cms'));
}