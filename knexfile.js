require('dotenv').config()
module.exports = {
  production: {
    client: 'cockroachdb',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './scripts/migrations',
    },
  },
}
