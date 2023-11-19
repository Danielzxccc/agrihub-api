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

export async function getTotalCount() {
  return await db
    .selectFrom('tags')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}

export async function getTags(
  offset: number,
  filterKey: string,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('tags')
    .selectAll()
    .leftJoin('forums_tags', 'forums_tags.tagid', 'tags.id')
    .groupBy(['tags.id'])
    .orderBy('tags.tag_name', 'asc')

  if (filterKey === 'name') query = query.orderBy('tags.tag_name', 'asc')

  return await query.limit(perpage).offset(offset).execute()
}
