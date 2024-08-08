'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        apps_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        device_id: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        device_type: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        ip: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        token_code: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        refresh_token: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        expired_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    }

    let token = db.getConnection().define('token', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt:false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8',
        hooks: {
            beforeCreate: function (obj) {
                let dt = new Date()
                dt.setDate(dt.getDate() + 1)
                obj.expired_date = dt
            }
        }
    })

    return token
}