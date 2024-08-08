'use strict';
module.exports = (rootpath, basepath) => {

    const dbConnection = require('./connection.js')(rootpath, basepath);

    class DB {

        constructor () {
            // props
            this.connections = {};
            this.activeConnections = {};
            this.defaultConnection = null;

            // methods
            this.addConnection = this.addConnection.bind(this);
            this.createConnection = this.createConnection.bind(this);
            this.connection = this.connection.bind(this);
        }

        addConnection (connectionName, {is_replication, read, write, database, log, dialect, timezone}, isDefault = false) {
            
            // connection name must be defined
            if (!typeof connectionName === 'string' || connectionName.length <= 0) {
                throw new Error('Please define connection name!');
            }

            // add to connections if not exist
            if (!this.connections[connectionName]) {
                // store connection data
                this.connections[connectionName] = {is_replication, read, write, database, log, dialect, timezone};
            }

            // add to defaultConnection if value is true
            if (isDefault) {
                this.defaultConnection = connectionName;
            }

            return this;
        }

        connection (connectionName) {
            let connectionString;

            if (this.connections[connectionName]) {
                connectionString = connectionName;
            } else if (this.connections[this.defaultConnection]) {
                connectionString = this.defaultConnection;
            } else if (Object.keys(this.connections).length > 0) {
                connectionString = Object.keys(this.connections)[0];
            } else {
                throw new Error('No connection is available!');
            }

            return this.createConnection(connectionString);
        }

        createConnection (connectionName) {
            if (!this.activeConnections[connectionName]) {
                if (!this.connections[connectionName]) {
                    throw new Error('Connection is not defined!');
                }

                this.activeConnections[connectionName] = new dbConnection(this.connections[connectionName]);
            }

            return this.activeConnections[connectionName];
        }

    }


    return DB
}