'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        url: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }

    let model = db.getConnection().define('data_image', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}