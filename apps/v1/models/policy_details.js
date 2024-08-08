'use strict'

module.exports = (db) => {
    let schema = {
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
    }

    let policy_details = db.getConnection().define('policy_details', schema, {
        timestamps: true,
        createdAt:'createdAt',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    
    return policy_details
}