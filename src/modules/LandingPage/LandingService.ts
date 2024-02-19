import {
  AddImageLanding,
  UpdateApproach,
  UpdateLanding,
} from '../../types/DBTypes'
import { db } from '../../config/database'

export async function listLandingPageDetails(id: string) {
  return await db
    .selectFrom('landing')
    .selectAll()
    .where('landing.id', '=', id)
    .executeTakeFirst()
}

export async function listApproach(id: string) {
  return await db
    .selectFrom('approach')
    .selectAll()
    .where('approach.id', '=', id)
    .executeTakeFirst()
}

export async function listImages(id: string) {
  return await db
    .selectFrom('landing_images')
    .selectAll()
    .where('landing_images.landing_id', '=', id)
    .executeTakeFirst()
}

export async function updateApproach(update: UpdateApproach) {
  return await db
    .updateTable('approach')
    .set(update)
    .returningAll()
    .executeTakeFirst()
}

export async function updateLanding(update: UpdateLanding) {
  return await db
    .updateTable('landing')
    .set(update)
    .returningAll()
    .executeTakeFirst()
}

export async function addImage(
  addImage: AddImageLanding
): Promise<AddImageLanding> {
  return await db
    .insertInto('landing_images')
    .values(addImage)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteImage(id: string) {
  return await db
    .deleteFrom('landing_images')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
