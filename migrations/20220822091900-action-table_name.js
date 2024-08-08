'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [

            /**
             *  You can enter the action to be executed
             *  Example : createTable
             * 
             *  queryInterface.createTable('table_name', {
                    id: {
                        type: Sequelize.INTEGER,
                        primaryKey: true,
                        autoIncrement: true,
                        allowNull: false
                    },
                    name: {
                        type: Sequelize.STRING(255),
                        allowNull: false
                    },
                    phone: {
                        type: Sequelize.STRING(255),
                        allowNull: false
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                        allowNull: false,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                        allowNull: true,
                        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                    }
                }, {
                    freezeTableName: true,
                    engine: 'InnoDB',
                    charset: 'utf8'
                })
                .then(function () {
                    return [
                        queryInterface.addIndex('table_name', ['phone'], { name:'tableNamePhone'})
                    ]
                })
             * 
             *  Example : Alter Table(addColumn)
             * 
             *  queryInterface.addColumn('table_name','column_name', {
                    type: Sequelize.STRING,
                    allowNull: true,
                })
             * 
             *  documentation Sequelize v5
             *  https://sequelize.org/v5/manual/migrations.html
             * 
             **/

        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            
            /** 
             *  You can enter the action before executed
             *  Example : dropTable
             * 
             *  queryInterface.dropTable('table_name')
             * 
             *  Example : removeColumn
             * 
             *  queryInterface.removeColumn('table_name', 'column_name')
             * 
             **/

        ];
        return Promise.all(migration);
    }
}