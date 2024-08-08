'use strict';

module.exports = (db) => {
    let schema = {
        token_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        admin_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        created_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        last_activity: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        }
    };

    let token_profile = db.getConnection().define('token_profile', schema, {
        timestamps: true,
        createdAt:'created_date',
        updatedAt:false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    });

    return token_profile;
}