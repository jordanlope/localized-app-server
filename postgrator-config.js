const config = require('./src/config')

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "connectionString": config.DATABASE_URL,
    // (config.env.NODE_ENV === 'test')
    // ? process.env.TEST_DATABASE_URL
}