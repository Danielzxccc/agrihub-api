import { NewTag, UserTag } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createUserTags(tags: UserTag[]) {
  return await db
    .insertInto('user_tags')
    .values(tags)
    .onConflict((oc) => oc.column('tagid').column('userid').doNothing())
    .execute()
}

export async function createTag(tag: NewTag) {
  return await db
    .insertInto('tags')
    .onConflict((oc) => oc.column('id').doUpdateSet(tag))
    .values(tag)
    .returningAll()
    .executeTakeFirst()
}

export async function viewTag(id: string) {
  return await db
    .selectFrom('tags')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findTags(tag: string) {
  let query = db.selectFrom('tags').selectAll()

  if (tag) query = query.where('tag_name', 'ilike', `${tag}%`)

  return await query.limit(20).execute()
}

export async function getTotalCount(filterKey: string, searchKey: string) {
  let query = db
    .selectFrom('tags')
    .select(({ fn }) => [fn.count<number>('tags.id').as('count')])

  if (searchKey.length) {
    query = query
      .leftJoin('forums_tags', 'forums_tags.tagid', 'tags.id')
      .where('tag_name', 'ilike', `%${searchKey}%`)
  }

  // if (filterKey === 'name') query = query.orderBy('tags.tag_name', 'asc')
  // if (filterKey === 'popular') query = query.orderBy('count', 'desc')
  // if (filterKey === 'newest') query = query.orderBy('createdat', 'desc')

  return await query.executeTakeFirst()
}

export async function getTags(
  offset: number,
  filterKey: string,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('tags')
    .leftJoin('forums_tags', 'forums_tags.tagid', 'tags.id')
    .select(({ fn }) => [
      'tags.id',
      'tag_name',
      'details',
      'createdat',
      fn.count<number>('forums_tags.tagid').as('count'),
    ])
    .groupBy([
      'tags.id',
      'forums_tags.tagid',
      'tags.tag_name',
      'tags.createdat',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('tag_name', 'ilike', `%${searchKey}%`),
        eb('details', 'ilike', `%${searchKey}%`),
      ])
    )
  }

  if (filterKey === 'name') query = query.orderBy('tags.tag_name', 'asc')
  if (filterKey === 'popular') query = query.orderBy('count', 'desc')
  if (filterKey === 'newest') query = query.orderBy('createdat', 'desc')
  return await query.limit(perpage).offset(offset).execute()
}

export async function deleteTag(id: string) {
  return await db
    .deleteFrom('tags')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
