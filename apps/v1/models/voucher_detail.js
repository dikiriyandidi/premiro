'use strict'

module.exports = (db) => {
    let schema = {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        voucher_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        voucher_code: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        used_date: {
            type: Sequelize.DATE,
        },
        used_by: {
            type: Sequelize.STRING(255),
        },
    }

    let model = db.getConnection().define('voucher_detail', schema, {
        timestamps: false,
        paranoid: false,
        underscored: true,
        freezeTableName: true,
        engine: 'InnoDB',
        charset: 'utf8'
    })

    return model
}