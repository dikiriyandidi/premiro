'use strict'

module.exports = (db) => {
    let schema = {
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
    }

    let policies = db.getConnection().define('policies', schema, {
        timestamps: true,
        createdAt:'createdAt',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    
    return policies
}