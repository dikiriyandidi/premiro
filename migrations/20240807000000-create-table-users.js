'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('users', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                original_user_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                last_login: {
                    type: Sequelize.DATE,
                    allowNull: true,
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
                    queryInterface.addIndex('users', ['original_user_id'], { name:'UsersOriginalUserID'}),
                    queryInterface.addIndex('users', ['status'], { name:'UsersStatus'}),
                    queryInterface.addIndex('users', ['deletedAt'], { name:'UsersDeletedAt'})
                ]
            })

        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('users')
        ];
        return Promise.all(migration);
    }
}