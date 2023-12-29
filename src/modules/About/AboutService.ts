import {
  AddImage,
  Gallery,
  UpdateAbout,
  UpdateGallery,
} from '../../types/DBTypes'
import { db } from '../../config/database'
import { AboutGallery } from 'kysely-codegen'

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

export async function deleteImage(id: string) {
  return await db
    .deleteFrom('about_gallery')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
