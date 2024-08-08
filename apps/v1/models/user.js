'use strict'
module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        spice_id: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Please fill out `spice_id` field!"
                }
            }
        },
        unique_id: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        fullname: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: ['0', '255'],
                    msg: "Please make sure that `fullname` is between 1-255 char length!"
                }
            }
        },
        gender: {
            type: Sequelize.ENUM('M', 'F', ''),
            allowNull: false,
            defaultValue: ''
        },
        birthdate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: '0000-00-00 00:00:00'
        },
        city_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        valid_phone_number: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        valid_email: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        subscribe: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        point: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        registration_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        register_cell_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        profile_picture: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        insert_date: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }

    let user = db.getConnection().define('user', schema, {
        timestamps: false,
        createdAt:'insert_date',
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })
    return user
}