'use strict'

module.exports = (db) => {
    let schema = {
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
    }
    
    let helps = db.getConnection().define('helps', schema, {
        timestamps: true,
        createdAt:'createdAt',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    
    return helps
}