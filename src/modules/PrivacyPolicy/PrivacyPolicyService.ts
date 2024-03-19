import { db } from '../../config/database'
import { UpdatePrivacyPolicy } from '../../types/DBTypes'
import { sql } from 'kysely'

export async function listPrivacyPolicy() {
  return await db
    .selectFrom('privacy_policy')
    .select('content')
    .executeTakeFirst()
}

export async function findPrivacyPolicy(id: string) {
  return await db
    .selectFrom('privacy_policy')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function updatePrivacyPolicy(update: UpdatePrivacyPolicy) {
  const result = await db
    .updateTable('privacy_policy')
    .set({ ...update, updatedat: sql`CURRENT_TIMESTAMP` })
    .returningAll()
    .executeTakeFirst()

  return result
}
