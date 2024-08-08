'use strict';


module.exports = (rootpath, basepath) => {

    const path = require('path');

    class Connection {

        constructor (connectionData) {
            // props
            this.connection;
            this.connectionData = connectionData;
            this.models = {};
            this.relations = require(rootpath + '/' + basepath + '/models/relations.js');

            // methods
            this.getConnection = this.getConnection.bind(this);
            this.model = this.model.bind(this);
        }

        connect ({is_replication, read, write, database, log, dialect, timezone}) {
            if (is_replication == 'true') {
                return new Sequelize(database, null, null, {
                    dialect: dialect,
                    logging: log, //log , false
                    benchmark: false,
                    pool: {
                        max: 5,
                        min: 0,
                        idle: 10000
                    },
                    timezone: timezone,
                    replication: {
                        read: [{
                            host: read.host,
                            username: read.user,
                            password: read.password,
                            port: read.port
                        }],
                        write: {
                            host: write.host,
                            username: write.user,
                            password: write.password,
                            port: write.port
                        }
                    }
                });

            } else {
                return new Sequelize(database, write.user, write.password, {
                    host: write.host,
                    dialect: dialect,
                    logging: log, //log , false
                    benchmark: false,
                    pool: {
                        max: 5,
                        min: 0,
                        idle: 10000
                    },
                    port: write.port,
                    timezone: timezone
                });
            }
        }

        getConnection () {
            if (!this.connection) {
                this.connection = this.connect(this.connectionData);
            }

            return this.connection;
        }

        model (modelName) {
            if (!this.models[modelName]) {
                let model = require(path.normalize(rootpath + '/' + basepath + '/models/' + modelName + '.js'))(this);

                this.models[modelName] = model;

                if (this.relations[modelName]) {
                    this.relations[modelName](model, this);
                }

                this.models[modelName] = model;
            }

            return this.models[modelName];
        }
    }
    return Connection;
}