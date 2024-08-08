'use strict'

module.exports = (db) => {
    let schema = {
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
    }

    let products = db.getConnection().define('products', schema, {
        timestamps: true,
        createdAt:'createdAt',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    
    return products
}