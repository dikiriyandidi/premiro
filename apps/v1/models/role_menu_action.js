'use strict'


module.exports = (db) => {
    let schema = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        role_id: {
          allowNull: false,
          type: Sequelize.INTEGER
        },
        menu_id: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        action_type: {
            allowNull: false,
            type: Sequelize.ENUM('view', 'add', 'edit','delete','export')
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

    let model = db.getConnection().define('role_menu_actions', schema, {
        timestamps: true,
        createdAt:'createdate',
        updatedAt: 'updatedate',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}