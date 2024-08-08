'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('articles', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
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
                link: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                like: {
                    type: Sequelize.INTEGER,
                    allowNull: false
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
                create_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false
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
                    queryInterface.addIndex('articles', ['local'], { name:'ArticlesLocal'}),
                    queryInterface.addIndex('articles', ['create_by'], { name:'ArticlesCreateBy'}),
                    queryInterface.addIndex('articles', ['status'], { name:'ArticlesStatus'}),
                    queryInterface.addIndex('articles', ['deletedAt'], { name:'ArticlesDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('articles')
        ];
        return Promise.all(migration);
    }
}