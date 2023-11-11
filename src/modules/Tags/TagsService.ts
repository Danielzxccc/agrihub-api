import { UserTag } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createUserTags(tags: UserTag[]) {
  return await db
    .insertInto('user_tags')
    .values(tags)
    .onConflict((oc) => oc.column('tagid').column('userid').doNothing())
    .execute()
}

export async function findTags(tag: string) {
  let query = db.selectFrom('tags').selectAll()

  if (tag) query = query.where('tag_name', 'ilike', `${tag}%`)

  return await query.limit(5).execute()
}
