'use strict'
const axios = require('axios');
const CONSTANT = require('./constant');

/** Event */
exports.list = (req, res, next) => {
    (async () => {
        axios
        .get(CONSTANT.API_URL)
        .then(function (response) {
            // salah satu yang menyebalkan dan bikin saya sering lupa
            // axios menambahkan properti "data" untuk menyimpan hasil response nya
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    })().catch(next);
}