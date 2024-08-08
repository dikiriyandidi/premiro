'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('policy_detail', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                policy_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                additional_insured: {
                    type: Sequelize.STRING(255),
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
                sum_insured: {
                    type: Sequelize.INTEGER(20),
                    allowNull: false
                },
                periodically_price: {
                    type: Sequelize.INTEGER(20),
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
                    queryInterface.addIndex('policy_detail', ['policy_id'], { name:'PolicyDetailPoliciID'}),
                    queryInterface.addIndex('policy_detail', ['periode_start'], { name:'PolicyDetailPeriodeStart'}),
                    queryInterface.addIndex('policy_detail', ['periode_end'], { name:'PolicyDetailPeriodeEnd'}),
                    queryInterface.addIndex('policy_detail', ['status'], { name:'PolicyDetailStatus'}),
                    queryInterface.addIndex('policy_detail', ['deletedAt'], { name:'PolicyDetailDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('policy_detail')
        ];
        return Promise.all(migration);
    }
}