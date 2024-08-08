'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        link: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        parent_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        em_class: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
            allowNull: false,
            defaultValue:'Published'
        },
        priority:{
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }

    let model = db.getConnection().define('menu', schema, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}