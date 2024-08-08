'use strict';

exports.landingPage = (req, res, next) => {
    (async () => {
        res.render('landing_page');
    })().catch(next)
}

exports.notFound = (req, res, next) => {
    (async() => {
        res.status(404).render('404');
    })().catch(next)
}

exports.weekend = (req, res, next) => {
    res.send("this is weekend!");
}