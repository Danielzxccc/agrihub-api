import { db } from '../../config/database'
import { sql } from 'kysely'
import { UpdateTermsConditions } from '../../types/DBTypes'

export async function listTermsConditions() {
  return await db
    .selectFrom('terms_condition')
    .select(['content', 'updatedat'])
    .executeTakeFirst()
}

export async function updateTermsConditions(updated: UpdateTermsConditions) {
  const result = await db
    .updateTable('terms_condition')
    .set({ ...updated, updatedat: sql`CURRENT_TIMESTAMP` })
    .returningAll()
    .executeTakeFirst()

  return result
}
