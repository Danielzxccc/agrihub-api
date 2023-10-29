import { UserTag } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createUserTags(tags: UserTag[]) {
  return await db.insertInto('user_tags').values(tags).execute()
}
