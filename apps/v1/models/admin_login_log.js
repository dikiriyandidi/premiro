'use strict'
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
            allowNull: true
        },
        status: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
    }

    let admin_login_log = db.getConnection().define('admin_login_log', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return admin_login_log
}