'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('article_comments', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                article_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                comment: {
                    type: Sequelize.TEXT,
                    allowNull: false
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
                    queryInterface.addIndex('article_comments', ['article_id'], { name:'ArticleCommentArticleID'}),
                    queryInterface.addIndex('article_comments', ['create_by'], { name:'ArticleCommentCreateBy'}),
                    queryInterface.addIndex('article_comments', ['status'], { name:'ArticleCommentStatus'}),
                    queryInterface.addIndex('article_comments', ['deletedAt'], { name:'ArticleCommentDeletedAt'})
                ]
            })
        ];
        return Promise.all(migration);
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('article_comments')
        ];
        return Promise.all(migration);
    }
}