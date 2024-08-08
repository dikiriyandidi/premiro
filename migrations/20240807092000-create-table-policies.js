'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('policies', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                order_insurance_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                insurance_name: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                no_policy: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                fullname: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                phone: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                birth_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                periode_start: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                periode_end: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                package: {
                    type: Sequelize.STRING(200),
                    allowNull: false
                },
                payment_frequency: {
                    type: Sequelize.STRING(200),
                    allowNull: false
                },
                periodically_price: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                total_price: {
                    type: Sequelize.INTEGER,
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
                    queryInterface.addIndex('policies', ['user_id'], { name:'PoliciesUserID'}),
                    queryInterface.addIndex('policies', ['order_insurance_id'], { name:'PoliciesOrderInsuranceID'}),
                    queryInterface.addIndex('policies', ['no_policy'], { name:'PoliciesNoPolicy'}),
                    queryInterface.addIndex('policies', ['periode_start'], { name:'PoliciesPeriodeStart'}),
                    queryInterface.addIndex('policies', ['periode_end'], { name:'PoliciesPeriodeEnd'}),
                    queryInterface.addIndex('policies', ['status'], { name:'PoliciesStatus'}),
                    queryInterface.addIndex('policies', ['deletedAt'], { name:'PoliciesDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('policies')
        ];
        return Promise.all(migration);
    }
}