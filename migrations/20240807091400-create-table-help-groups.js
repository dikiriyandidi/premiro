'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('help_groups', {
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
                image: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                local: {
                    type: Sequelize.ENUM('ID','EN'),
                    allowNull: false,
                    defaultValue: 'ID'
                },
                status: {
                    type: Sequelize.ENUM('Active','Inactive'),
                    allowNull: false,
                    default: 'Active'
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
                    queryInterface.addIndex('help_groups', ['local'], { name:'HelpGroupsLocal'}),
                    queryInterface.addIndex('help_groups', ['status'], { name:'HelpGroupsStatus'}),
                    queryInterface.addIndex('help_groups', ['deletedAt'], { name:'HelpGroupsDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('help_groups')
        ];
        return Promise.all(migration);
    }
}