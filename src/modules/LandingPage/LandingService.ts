import {
  AddImageLanding,
  UpdateApproach,
  UpdateLanding,
} from '../../types/DBTypes'
import { db } from '../../config/database'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { sql } from 'kysely'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'

export async function listLandingPageDetails() {
  return await db
    .selectFrom('landing as l')
    .select(({ eb }) => [
      'id',
      'cta_header',
      'cta_description',
      'approach',
      'updatedat',
      'createdat',
      jsonArrayFrom(
        eb
          .selectFrom('landing_images as li')
          .select(({ val, fn }) => [
            sql<string>`CAST(li.id AS TEXT)`.as('id'),
            'li.index',
            fn<string>('concat', [val(returnObjectUrl()), 'li.images']).as(
              'image'
            ),
          ])
          .whereRef('li.landing_id', '=', 'l.id')
      ).as('images'),
      jsonArrayFrom(
        eb
          .selectFrom('approach as a')
          .select([
            sql<string>`CAST(a.id AS TEXT)`.as('id'),
            'a.icon',
            'a.title',
            'a.description',
          ])
      ).as('approach_items'),
    ])
    .executeTakeFirst()
}

export async function updateLanding(update: UpdateLanding) {
  return await db
    .updateTable('landing')
    .set(update)
    .returningAll()
    .executeTakeFirst()
}

export async function InsertImage(
  addImage: AddImageLanding
): Promise<AddImageLanding> {
  return await db
    .insertInto('landing_images')
    .values(addImage)
    .returningAll()
    .executeTakeFirst()
}

export async function listImages(id: string) {
  return await db
    .selectFrom('landing_images')
    .selectAll()
    .where('landing_images.landing_id', '=', id)
    .execute()
}

export async function deleteImage(id: string) {
  return await db
    .deleteFrom('landing_images')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findImage(id: string) {
  return await db
    .selectFrom('landing_images')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function upsertApproach(update: UpdateApproach) {
  return await db
    .insertInto('approach')
    .values(update)
    .onConflict((oc) => oc.column('id').doUpdateSet(update))
    .returningAll()
    .executeTakeFirst()
}

export async function deleteApproach(id: string) {
  return await db
    .deleteFrom('approach')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}
