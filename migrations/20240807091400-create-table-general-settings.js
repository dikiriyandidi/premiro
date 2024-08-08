'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('general_settings', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                s_k: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                term_privacy: {
                    type: Sequelize.TEXT,
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
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('general_settings', ['deletedAt'], { name:'GeneralSettingsDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('general_settings')
        ];
        return Promise.all(migration);
    }
}