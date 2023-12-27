import { AddImage, Gallery, UpdateAbout } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function updateAboutPage(update: UpdateAbout) {
  return await db
    .updateTable('about_cms')
    .set(update)
    .returningAll()
    .executeTakeFirst()
}

export async function addImage(addImage: Gallery): Promise<Gallery> {
  return await db
    .insertInto('about_gallery')
    .values(addImage)
    .returningAll()
    .executeTakeFirst()
}
