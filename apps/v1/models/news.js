'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        string_id: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT("long"),
            allowNull: false
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updated_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
    }

    let model = db.getConnection().define('news', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt:'updated_date',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}