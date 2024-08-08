'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('products', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                product_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                image: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                periode_start: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                periode_end: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                is_all_time: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                seq: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                font: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                font_color: {
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
                    queryInterface.addIndex('products', ['product_type_id'], { name:'productsProductTypeID'}),
                    queryInterface.addIndex('products', ['periode_start'], { name:'productsPeriodeStart'}),
                    queryInterface.addIndex('products', ['periode_end'], { name:'productsPeriodeEnd'}),
                    queryInterface.addIndex('products', ['is_all_time'], { name:'productsIsAllTime'}),
                    queryInterface.addIndex('products', ['seq'], { name:'productsSeq'}),
                    queryInterface.addIndex('products', ['local'], { name:'productsLocal'}),
                    queryInterface.addIndex('products', ['status'], { name:'productsStatus'}),
                    queryInterface.addIndex('products', ['deletedAt'], { name:'productsDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('products')
        ];
        return Promise.all(migration);
    }
}