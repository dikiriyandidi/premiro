'use strict'

/** Test */
exports.get = (req, res, next) => {
    (async () => {
        let url = 'https://catfact.ninja/breeds';
        let header = {};
        let payload = {};
        let test = await req.lib("request").requestGet(url, payload, header);
        res.success(test);
    })().catch(next);
}

exports.post = (req, res, next) => {
    (async () => {
        let url = 'https://randomuser.me/api/';
        let header = {};
        let payload = {};
        let test = await req.lib("request").requestPost(url, payload, header);
        res.success(test);
    })().catch(next);
}