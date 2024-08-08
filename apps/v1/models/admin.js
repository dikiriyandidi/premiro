'use strict'
let libpw = require('../libs/password')
module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        fullname: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        last_login: {
            type: Sequelize.DATE,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('Active','Inactive'),
            allowNull: false,
            defaultValue: 'Active'
        }
    }

    let model = db.getConnection().define('admin', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt:false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8',
        hooks: {
            beforeCreate: (data, options)=>{
                data.password = libpw.encryptPasswordCms(data.password)
            },
            beforeUpdate: (data, options)=>{
                data.password = libpw.encryptPasswordCms(data.password)
            },
        }
    })

    return model
}