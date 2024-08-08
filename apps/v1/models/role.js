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
        status:{
            type: Sequelize.ENUM('Published', 'Unpublished'),
            defaultValue: 'Published',
            allowNull: false            
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updated_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
    }

    let model = db.getConnection().define('role', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt: 'updated_date',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}