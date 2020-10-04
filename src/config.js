

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://jordanlopez992@localhost/localized_server",
    JWT_SECRET: "Jordanlopez992"
}