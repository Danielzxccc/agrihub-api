import { UpdateAbout } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function updateAboutPage(update: UpdateAbout) {
  console.log(update)
  return await db
    .updateTable('about_cms')
    .set(update)
    .returningAll()
    .executeTakeFirst()
}
