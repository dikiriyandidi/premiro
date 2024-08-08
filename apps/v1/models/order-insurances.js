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
    }

    let order_insurances = db.getConnection().define('order_insurances', schema, {
        timestamps: true,
        createdAt:'createdAt',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    
    return order_insurances
}