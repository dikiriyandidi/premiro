require('dotenv').config()

module.exports = {
    username: process.env.DB_W_USERNAME,
    password: process.env.DB_W_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_W_HOST,
    port: process.env.DB_W_PORT || 3306,
    dialect: process.env.DB_DIALECT
};