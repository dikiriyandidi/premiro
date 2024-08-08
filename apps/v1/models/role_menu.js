'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        role_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        menu_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        is_home: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    }

    let model = db.getConnection().define('role_menu', schema, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}