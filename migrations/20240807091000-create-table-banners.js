'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('banners', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                banner_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                title: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                description: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                image: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                duration: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                periode_start: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                periode_end: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                is_all_time: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                seq: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                font: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                font_color: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                local: {
                    type: Sequelize.ENUM('ID','EN'),
                    allowNull: false,
                    defaultValue: 'ID'
                },
                status: {
                    type: Sequelize.ENUM('Active','Inactive'),
                    allowNull: false,
                    default: 'Active'
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                },
                deletedAt: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('banners', ['banner_type_id'], { name:'BannersBannerTypeID'}),
                    queryInterface.addIndex('banners', ['periode_start'], { name:'BannersPeriodeStart'}),
                    queryInterface.addIndex('banners', ['periode_end'], { name:'BannersPeriodeEnd'}),
                    queryInterface.addIndex('banners', ['is_all_time'], { name:'BannersIsAllTime'}),
                    queryInterface.addIndex('banners', ['seq'], { name:'BannersSeq'}),
                    queryInterface.addIndex('banners', ['local'], { name:'BannersLocal'}),
                    queryInterface.addIndex('banners', ['status'], { name:'BannersStatus'}),
                    queryInterface.addIndex('banners', ['deletedAt'], { name:'BannersDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('banners')
        ];
        return Promise.all(migration);
    }
}