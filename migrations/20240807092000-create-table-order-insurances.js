'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('order_insurances', {
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
                insurance_id: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                insurance_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                insurance_type: {
                    type: Sequelize.ENUM('motor_vehicle','property','others'),
                    allowNull: false
                },
                insurance_periode_start: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                insurance_periode_end: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                package_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                package_note: {
                    type: Sequelize.TEXT,
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
                    queryInterface.addIndex('order_insurances', ['user_id'], { name:'OrderInsurancesUserID'}),
                    queryInterface.addIndex('order_insurances', ['insurance_id'], { name:'OrderInsurancesInsuranceID'}),
                    queryInterface.addIndex('order_insurances', ['insurance_type'], { name:'OrderInsurancesInsuranceType'}),
                    queryInterface.addIndex('order_insurances', ['insurance_periode_start'], { name:'OrderInsurancesInsurancePeriodeStart'}),
                    queryInterface.addIndex('order_insurances', ['insurance_periode_end'], { name:'OrderInsurancesInsurancePeriodeEnd'}),
                    queryInterface.addIndex('order_insurances', ['package_id'], { name:'OrderInsurancesPackageID'}),
                    queryInterface.addIndex('order_insurances', ['status'], { name:'OrderInsurancesStatus'}),
                    queryInterface.addIndex('order_insurances', ['deletedAt'], { name:'OrderInsurancesDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('order_insurances')
        ];
        return Promise.all(migration);
    }
}