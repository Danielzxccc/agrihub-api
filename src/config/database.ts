import { Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  // log(event) {
  //   if (event.level === 'query') {
  //     console.log(event.query.sql)
  //     console.log(event.query.parameters)
  //   }
  // },
})
