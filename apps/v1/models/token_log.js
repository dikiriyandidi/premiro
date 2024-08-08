'use strict';

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        token_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        user_agent: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        path: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        method: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        request: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        response: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        final_action: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        memory_usage: {
            type: Sequelize.FLOAT(18,8),
            allowNull: true
        },
        time_elapse: {
            type: Sequelize.FLOAT(18,8),
            allowNull: true
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        api_version: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    };

    let token_log = db.getConnection().define('token_log', schema, {
        timestamps: true,
        createdAt:'start_date',
        updatedAt: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    });

    return token_log;
}