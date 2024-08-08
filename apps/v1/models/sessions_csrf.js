'use strict'
module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        session_id: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        csrf_storage: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updated_date:{
            type: Sequelize.DATE,
            allowNull: false
        }
    }

    let sessions_csrf = db.getConnection().define('sessions_csrf', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt: 'updated_date',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return sessions_csrf
}