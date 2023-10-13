require('dotenv').config()
module.exports = {
  development: {
    client: 'cockroachdb',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './scripts/migrations',
    },
  },
}
