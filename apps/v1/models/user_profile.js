'use strict';

module.exports = (db) => {
    let schema = {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        bio: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        user_avatar: {
            type: Sequelize.STRING,
            allowNull: false
        },
        background: {
            type: Sequelize.STRING,
            allowNull: false
        },
        job_profile: {
            type: Sequelize.STRING,
            allowNull: true
        },
        job_location: {
            type: Sequelize.STRING,
            allowNull: true
        }
    };
    let user_profile = db.getConnection().define('user_profile', schema, {
        timestamps: true,
        createdAt:false,
        updatedAt:false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    });
    return user_profile;
}