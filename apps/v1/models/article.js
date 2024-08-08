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
        content: {
            type: Sequelize.TEXT("LONG"), //type: Sequelize.TEXT,
            allowNull: true
        },
        preview_content: {
            type: Sequelize.TEXT, //type: Sequelize.STRING(256),
            allowNull: true
        },
        type: {
            type: Sequelize.ENUM('image', 'video'),
            defaultValue: 'image',
            allowNull: true
        },
        featured_image: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        video_file: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        video_cover: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        is_highlight: {
            type: Sequelize.ENUM('Yes', 'No'),
            defaultValue: 'Yes'
        },
        view_count: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        publishdate: {
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
        },
        status: {
            type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
            defaultValue: 'Published'
        }
    }

    let article = db.getConnection().define('article', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt: 'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return article
}