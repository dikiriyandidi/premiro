'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('admins', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                original_admin_id: {
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
                    queryInterface.addIndex('admins', ['original_admin_id'], { name:'AdminsOriginalUserID'}),
                    queryInterface.addIndex('admins', ['status'], { name:'AdminsStatus'}),
                    queryInterface.addIndex('admins', ['deletedAt'], { name:'AdminsDeletedAt'})
                ]
            })

        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('admins')
        ];
        return Promise.all(migration);
    }
}