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
            type: Sequelize.STRING(256),
            allowNull: true
        },
        title: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        city_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        venue: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        address: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        event_description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        featured_image: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
            defaultValue: 'Published'
        },
        is_featured: {
            type: Sequelize.ENUM('TRUE', 'FALSE'),
            defaultValue: 'FALSE'
        },
        view_count: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        startdate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        enddate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        publish_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
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
        }
    }

    let event = db.getConnection().define('event', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt: 'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return event
}