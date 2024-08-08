'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        type_value: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        quota: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        custom_code: {
            type: Sequelize.ENUM('Yes','No'),
            defaultValue: 'Yes'
        },
        general_code: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updated_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
            defaultValue: 'Published'
        },
    }

    let model = db.getConnection().define('voucher', schema, {
        timestamps: false,
        paranoid: false,
        updatedAt:'updated_date',
        createdAt: 'created_date',
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}