'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('helps', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                help_group_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                product_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                question: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                answer: {
                    type: Sequelize.TEXT,
                    allowNull: true
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
                    queryInterface.addIndex('helps', ['help_group_id'], { name:'HelpsGroupID'}),
                    queryInterface.addIndex('helps', ['product_type_id'], { name:'HelpsTypeID'}),
                    queryInterface.addIndex('helps', ['local'], { name:'HelpsLocal'}),
                    queryInterface.addIndex('helps', ['status'], { name:'HelpsStatus'}),
                    queryInterface.addIndex('helps', ['deletedAt'], { name:'HelpsDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('helps')
        ];
        return Promise.all(migration);
    }
}