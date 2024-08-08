'use strict'

module.exports = {
    up: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.createTable('apps', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                secret_key: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                last_activity: {
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
                    queryInterface.addIndex('apps', {fields:['name'], name:'name'}),
                    queryInterface.addIndex('apps', {fields:['secret_key'], name:'secret_key'}),
                
                    queryInterface.bulkInsert('apps', [
                        { name: 'admin', secret_key: 'admin123'},
                        { name: 'user', secret_key: 'user123'}
                    ])
                ]
            }),
            queryInterface.createTable('token', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                apps_id: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                device_id: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                device_type: {
                    type: Sequelize.STRING(50),
                    allowNull: true
                },
                ip: {
                    type: Sequelize.STRING(50),
                    allowNull: true
                },
                token_code: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                refresh_token: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                expired_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('token', {fields:['token_code'], name:'token_code'}),
                    queryInterface.addIndex('token', {fields:['apps_id'], name:'apps_id'}),
                    queryInterface.addIndex('token', {fields:['device_id'], name:'device_id'}),
                    queryInterface.addIndex('token', {fields:['refresh_token'], name:'refresh_token'}),
                    queryInterface.addIndex('token', {fields:['expired_date'], name:'expired_date'}),
                    queryInterface.addIndex('token', {fields:['created_date'], name:'created_date'})
                ]
            }),
            queryInterface.createTable('token_profile', {
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
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                last_activity: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('token_profile', {fields:['user_id'], name:'user_id'}),
                    queryInterface.addIndex('token_profile', {fields:['admin_id'], name:'admin_id'})
                ]
            }),
            queryInterface.createTable('token_log', {
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
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                end_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                memory_usage: {
                    type: Sequelize.FLOAT(18, 8),
                    allowNull: true
                },
                time_elapse: {
                    type: Sequelize.FLOAT(18, 8),
                    allowNull: true
                },
                api_version: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('token_log', {fields:['token_id'], name:'token_id'})
                ]
            }),
            queryInterface.createTable('admin', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                fullname: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                password: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                    allowNull: false
                },
                last_login: {
                    type: 'TIMESTAMP',
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                    allowNull: false
                },
                status: {
                    type: Sequelize.ENUM('Active','Inactive'),
                    allowNull: false
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    // Populate Initial Data
                    queryInterface.bulkInsert('admin', [
                        { id: 1, email: 'admin@weekendinc.com', fullname: 'Admin', password: '$iyp2aD$.slqb85gCNKJ1eQjdTVd58F8Db63yK0iVHmizt7hQI04=', created_date: '2019-07-16 08:55:59', last_login: '2019-07-16 08:55:59', status: 'Active'},
                        { id: 2, email: 'admin2@weekendinc.com', fullname: 'Admin2', password: '$6fLZfO$.e6UrSlbs0SAjEwofH/WmF1Evjc1tW4SG/O1xm154w/w=', created_date: '2019-07-16 08:52:06', last_login: '2019-07-16 08:52:06', status: 'Active'}
                    ])
                ]
            }),
            queryInterface.createTable('admin_role', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                admin_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                role_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('admin_role', {fields:['admin_id'], name:'admin_id'}),
                    queryInterface.addIndex('admin_role', {fields:['role_id'], name:'role_id'}),

                    // Populate Initial Data
                    queryInterface.bulkInsert('admin_role', [
                        { id: 1, admin_id: 1, role_id: 1, created_at: '2019-07-13 06:51:59', updated_at: '2019-07-13 06:51:59'},
                        { id: 2, admin_id: 2, role_id: 2, created_at: '2019-07-13 08:07:52', updated_at: '2019-07-13 08:07:52'}
                    ])
                ]
            }),
            queryInterface.createTable('menu', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                link: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                parent_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                priority: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                em_class: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                status: {
                    type: Sequelize.ENUM('Published','Unpublished','Trashed'),
                    allowNull: false
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    // Populate Initial Data
                    queryInterface.bulkInsert('menu', [
                        {id: 1, name: 'Main Navigation', link: '#', parent_id: 0, priority: 1, em_class:'', status: 'Published'},
                        {id: 2, name: 'Master', link: '#', parent_id: 1, priority: 2, em_class:'', status: 'Unpublished'},
                        {id: 3, name: 'Setting', link: '#', parent_id: 1, priority: 5, em_class:'icon-settings', status: 'Published'},
                        {id: 4, name: 'Admin List', link: '/cms/setting/admin_list', parent_id: 3, priority: 1, em_class:'', status: 'Published'},
                        {id: 5, name: 'User Access', link: '/cms/setting/user_access', parent_id: 3, priority: 2, em_class:'', status: 'Published'},
                        {id: 6, name: 'Article', link: '/cms/article', parent_id: 1, priority: 2, em_class:'', status: 'Published'},
                        {id: 7, name: 'Upload Image', link: '/cms/upload_image', parent_id: 1, priority: 3, em_class:'', status: 'Published'},
                        {id: 8, name: 'Event', link: '#', parent_id: 1, priority: 3, em_class:'', status: 'Published'},
                        {id: 9, name: 'Event', link: '/cms/event/event_list', parent_id: 8, priority: 1, em_class:'', status: 'Published'},
                        {id: 10, name: 'City List', link: '/cms/event/city_list', parent_id: 8, priority: 2, em_class:'', status: 'Published'},
                        {id: 11, name: 'Voucher', link: '/cms/voucher', parent_id: 1, priority: 4, em_class:'', status: 'Published'},
                        {id: 12, name: 'Menu', link: '/cms/setting/menu', parent_id: 3, priority: 3, em_class:'', status: 'Published'},
                        {id: 13, name: 'Role List', link: '/cms/setting/role_list', parent_id: 3, priority: 4, em_class:'', status: 'Published'},
                    ])
                ]
            }),
            queryInterface.createTable('role', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                },
                status: {
                    type: Sequelize.ENUM('Published','Unpublished','Trashed'),
                    allowNull: false
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    // Populate Initial Data
                    queryInterface.bulkInsert('role', [
                        { id: 1, name: 'Super Admin', created_date: '2019-07-12 05:33:44', updated_date: '2019-07-12 05:33:44', status: 'Published'},
                        { id: 2, name: 'Admin', created_date: '2019-07-12 05:33:44', updated_date: '2019-07-12 05:33:44', status: 'Published'}
                    ])
                ]
            }),
            queryInterface.createTable('role_menu', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                role_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                menu_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                is_home: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('role_menu', {fields:['role_id'], name:'role_id'}),
                    queryInterface.addIndex('role_menu', {fields:['menu_id'], name:'menu_id'}),

                    // Populate Initial Data
                    queryInterface.bulkInsert('role_menu', [
                        {id: 1, role_id: 1, menu_id: 5, is_home: 0, created_date: '2018-07-13 07:19:35', updated_date: '2018-07-13 07:19:35'},
                        {id: 2, role_id: 1, menu_id: 1, is_home: 0, created_date: '2018-07-13 07:19:01', updated_date: '2018-07-13 07:19:01'},
                        {id: 3, role_id: 1, menu_id: 2, is_home: 1, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 4, role_id: 1, menu_id: 3, is_home: 0, created_date: '2018-07-13 07:19:01', updated_date: '2018-07-13 07:19:01'},
                        {id: 5, role_id: 1, menu_id: 4, is_home: 0, created_date: '2018-07-13 07:19:01', updated_date: '2018-07-13 07:19:01'},
                        {id: 19, role_id: 1, menu_id: 6, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 20, role_id: 1, menu_id: 7, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 21, role_id: 1, menu_id: 8, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 22, role_id: 1, menu_id: 9, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 23, role_id: 1, menu_id: 10, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 24, role_id: 1, menu_id: 11, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 25, role_id: 1, menu_id: 12, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'},
                        {id: 26, role_id: 1, menu_id: 13, is_home: 0, created_date: '2018-09-26 06:23:39', updated_date: '2018-09-26 06:23:39'}
                    ])
                ]
            }),
            queryInterface.createTable('session_login_log', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER
                },
                admin_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                session:{
                  allowNull: false,
                  type: Sequelize.TEXT
                },
                status: {
                    type: Sequelize.ENUM('Active', 'Inactive'),
                    defaultValue: 'Active',
                },
                createdate: {
                    allowNull: false,
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                last_activity: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                },
                expired_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                }
            }),
            queryInterface.createTable('article', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                string_id: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },  
                title: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                content: {
                    type: Sequelize.TEXT("LONG"), //type: Sequelize.TEXT,
                    allowNull: true
                },
                preview_content: {
                    type: Sequelize.TEXT, //type: Sequelize.STRING(256),
                    allowNull: true
                },
                type: {
                    type: Sequelize.ENUM('image', 'video'),
                    defaultValue: 'image',
                    allowNull: true
                },
                featured_image: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                video_file: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                video_cover: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                is_highlight: {
                    type: Sequelize.ENUM('Yes', 'No'),
                    defaultValue: 'Yes'
                },
                view_count: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                },
                publishdate: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                createdate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updatedate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                },
                status: {
                    type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
                    defaultValue: 'Published'
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('article', ['id'])
                ]
            }),
            queryInterface.createTable('data_image', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                url: {
                    type: Sequelize.STRING(256),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('data_image', ['id'])
                ]
            }),
            queryInterface.createTable('event_city', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                city_name: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                description: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                createdate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updatedate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                },
                status: {
                    type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
                    defaultValue: 'Published'
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('event_city', ['id'])
                ]
            }),
            queryInterface.createTable('event', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                string_id: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                title: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                city_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                venue: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                address: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                event_description: {
                    type: Sequelize.TEXT,
                    allowNull: true
                },
                featured_image: {
                    type: Sequelize.STRING(256),
                    allowNull: true
                },
                status: {
                    type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
                    defaultValue: 'Published'
                },
                is_featured: {
                    type: Sequelize.ENUM('TRUE', 'FALSE'),
                    defaultValue: 'FALSE'
                },
                campaign: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                view_count: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0
                },
                startdate: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                enddate: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                publish_date: {
                    type: Sequelize.DATE,
                    defaultValue: Sequelize.NOW,
                },
                createdate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updatedate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('event', ['id','city_id'])
                ]
            }),
            queryInterface.createTable('voucher', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                type: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                type_value: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                quota: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                custom_code: {
                    type: Sequelize.ENUM('Yes','No'),
                    defaultValue: 'Yes'
                },
                general_code: {
                    type: Sequelize.STRING(255),
                    allowNull: false
                },
                start_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                end_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                },
                status: {
                    type: Sequelize.ENUM('Published', 'Unpublished', 'Trash'),
                    defaultValue: 'Published'
                },
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('voucher', ['id'])
                ]
            }),
            queryInterface.createTable('voucher_detail', {
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
                    type: Sequelize.STRING(255),
                },
                used_by: {
                    type: Sequelize.STRING(255),
                },
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('voucher_detail', ['id'])
                ]
            }),
            queryInterface.createTable('admin_login_log', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                email: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                status: {
                    type: Sequelize.STRING(50),
                    allowNull: true
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('admin_login_log', {fields:['email'], name:'email'}),
                    queryInterface.addIndex('admin_login_log', {fields:['status'], name:'status'}),
                    queryInterface.addIndex('admin_login_log', {fields:['created_date'], name:'created_date'})
                ]
            }),
            queryInterface.createTable('sessions_csrf', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                session_id: {
                    type: Sequelize.STRING(255),
                    allowNull: true
                },
                csrf_storage: {
                    type: Sequelize.TEXT,
                    allowNull: true
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updated_date:{
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('sessions_csrf', {fields:['session_id'], name:'session_id'})
                ]
            }),
            queryInterface.createTable('role_menu_actions', {
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
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updatedate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }).then(function () {
                return [
                    queryInterface.bulkInsert('role_menu_actions', [
                        {id: 1, role_id: 1, menu_id: 6, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 2, role_id: 1, menu_id: 7, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 3, role_id: 1, menu_id: 9, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 4, role_id: 1, menu_id: 10, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 5, role_id: 1, menu_id: 11, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 6, role_id: 1, menu_id: 4, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 7, role_id: 1, menu_id: 5, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 8, role_id: 1, menu_id: 12, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 9, role_id: 1, menu_id: 13, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'},
                        {id: 10, role_id: 1, menu_id: 14, action_type: 'view', createdate: '2020-11-30 14:58:32', updatedate: '2020-11-30 14:58:32'}
                    ])
                ]
            }),
            queryInterface.createTable('sessions', {
                session_id: {
                    type: Sequelize.STRING(32),
                    allowNull: false,
                    primaryKey: true
                },
                expires: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                data:{
                    type: Sequelize.TEXT,
                    allowNull: true
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).then(function () {
                return [
                    queryInterface.addIndex('sessions', {fields:['expires'], name:'expires'})
                ]
            })
        ];
        return Promise.all(migration);
        
    },
    down: function (queryInterface, Sequelize) {
        let migration = [
            queryInterface.dropTable('apps'),
            queryInterface.dropTable('token'),
            queryInterface.dropTable('token_profile'),
            queryInterface.dropTable('token_log'),
            queryInterface.dropTable('admin'),
            queryInterface.dropTable('admin_role'),
            queryInterface.dropTable('menu'),
            queryInterface.dropTable('role'),
            queryInterface.dropTable('role_menu'),
            queryInterface.dropTable('session_login_log'),
            queryInterface.dropTable('article'),
            queryInterface.dropTable('data_image'),
            queryInterface.dropTable('event_city'),
            queryInterface.dropTable('event'),
            queryInterface.dropTable('voucher'),
            queryInterface.dropTable('voucher_detail'),
            queryInterface.dropTable('admin_login_log'),
            queryInterface.dropTable('sessions_csrf'),
            queryInterface.dropTable('role_menu_actions'),
            queryInterface.dropTable('sessions')
        ];
        return Promise.all(migration);
       
    }
}