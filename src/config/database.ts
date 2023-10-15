import { Kysely, PostgresDialect } from 'kysely'
import { DB } from 'kysely-codegen'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'
import log from '../utils/utils'
dotenv.config()

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  log(event) {
    if (event.level === 'query') {
      log.info(event.query.sql)
      log.info(event.query.parameters)
    }
  },
})
