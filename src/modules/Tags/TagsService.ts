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

export async function getNewForums(offset = 0, limit = 20) {
  try {
    const newForums = await db
      .selectFrom('forums')
      .selectAll()
      //.orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .execute()

    return newForums
  } catch (error) {
    throw new Error('Error fetching new forums: ' + error.message)
  }
}

export async function getPopularForums() {
  try {
    const popularForums = await db
    let query = db.selectFrom('forums').selectAll().orderBy('upvotes', 'desc') //wala pa upvotes

    return await query.limit(5).execute()

    return popularForums
  } catch (error) {
    throw new Error('Error fetching popular forums: ' + error.message)
  }
}
