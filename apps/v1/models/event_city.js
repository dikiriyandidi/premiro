'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        city_name: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        description: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        createdate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updatedate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        status: {
            type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
            defaultValue: 'Published'
        }
    }
    let event_city = db.getConnection().define('event_city', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt:'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return event_city
}