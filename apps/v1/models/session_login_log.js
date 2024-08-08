'use strict'
module.exports = (db) => {
    let schema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        admin_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        session:{
          allowNull: false,
          type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.ENUM('Active', 'Inactive'),
            defaultValue: 'Active',
        },
        createdate: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        last_activity: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: new Date()
        },
        expired_date: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: new Date()
        }
    }

    let event = db.getConnection().define('session_login_log', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return event
}


