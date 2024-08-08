'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('partner_products', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                partner_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                product_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                image: {
                    type: Sequelize.STRING(255),
                    allowNull: false
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
                    queryInterface.addIndex('partner_products', ['partner_id'], { name:'PartnerProductsPartnerID'}),
                    queryInterface.addIndex('partner_products', ['product_id'], { name:'PartnerProductsProductID'}),
                    queryInterface.addIndex('partner_products', ['status'], { name:'PartnerProductsStatus'}),
                    queryInterface.addIndex('partner_products', ['deletedAt'], { name:'PartnerProductsDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('partner_products')
        ];
        return Promise.all(migration);
    }
}