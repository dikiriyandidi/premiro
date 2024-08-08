'use strict'

module.exports = {
    user: (model, db) => {
        model.hasOne(db.model('user_profile'), {foreignKey: 'user_id'});
    },
    user_profile: (model, db) => {
        model.belongsTo(db.model('user'), {foreignKey: 'user_id'})
    },
    // model for token
    token: (model, db) => {
        model.hasOne(db.model('token_profile'), {foreignKey: 'token_id'})
        model.hasMany(db.model('token_log'), {foreignKey: 'token_id'})
        model.belongsTo(db.model('apps'), {foreignKey: 'apps_id'})
    },
    apps: (model, db) => {
        model.hasMany(db.model('token'), {foreignKey: 'apps_id'});
    },
    token_profile: (model, db) => {
        model.belongsTo(db.model('token'), {foreignKey: 'token_id'})
    },
    token_log: (model, db) => {
        model.belongsTo(db.model('token'), {foreignKey: 'token_id'});
    },
    admin: (model, db) => {
        model.hasMany(db.model('admin_role'), {foreignKey: 'admin_id'})
    },
    role: (model, db) => {
        model.hasMany(db.model('admin_role'), {foreignKey: 'role_id'})
        model.hasMany(db.model('role_menu'), {foreignKey: 'role_id'})
    },
    admin_role: (model, db) => {
        model.belongsTo(db.model('admin'), {foreignKey: 'admin_id'})
        model.belongsTo(db.model('role'), {foreignKey: 'role_id'})
    },
    menu: (model, db) => {
        model.hasMany(db.model('role_menu'), {foreignKey: 'menu_id'})
    },
    role_menu: (model, db) => {
        model.belongsTo(db.model('menu'), {foreignKey: 'menu_id'})
        model.belongsTo(db.model('role'), {foreignKey: 'role_id'})
    }
}