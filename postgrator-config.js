const config = require('./src/config')

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "connectionString": config.DATABASE_URL,
}