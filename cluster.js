'use strict';

const cluster = require('cluster');

if (cluster.isMaster) {
    let workersCount = require('os').cpus().length;
    
    for (let i = 0; i < workersCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        cluster.fork();
    })
} else {
    require('./server.js');
}
