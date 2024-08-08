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
        secret_key: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        last_activity: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }

    let token = db.getConnection().define('apps', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt:false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return token
}