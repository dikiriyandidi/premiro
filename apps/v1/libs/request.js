'use strict'
const axios = require('axios')

/** Handling Reuqest GET */
exports.requestGet = async (url, payload, header) => {
    await axios
    .get(url, payload, header)
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        return error;
    });
}

/** Handling Reuqest POST */
exports.requestPost = async (url, payload, header) => {
    await axios
    .post(url, payload, header)
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        return error;
    });
}