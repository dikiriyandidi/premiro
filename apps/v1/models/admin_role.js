'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        admin_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        role_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        }
    }

    let model = db.getConnection().define('admin_role', schema, {
        timestamps: true,
        createdAt:'created_at',
        updatedAt: 'updated_at',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}