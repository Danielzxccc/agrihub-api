import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewLearningCredits,
  NewLearningMaterial,
  NewLearningResource,
  NewLearningTags,
  UpdateLearningMaterial,
} from '../../types/DBTypes'

export async function findLearningMaterial(id: string) {
  return await db
    .selectFrom('learning_materials')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findLearningResource(id: string) {
  return await db
    .selectFrom('learning_resource')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findLearningCredits(id: string) {
  return await db
    .selectFrom('learning_credits')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findLearningTag(id: string) {
  return await db
    .selectFrom('learning_tags')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function insertLearningMaterial(material: NewLearningMaterial) {
  return await db
    .insertInto('learning_materials')
    .values(material)
    .returningAll()
    .executeTakeFirst()
}

export async function updateLearningMaterial(
  id: string,
  material: UpdateLearningMaterial
) {
  return await db
    .updateTable('learning_materials')
    .set({ ...material, published_date: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function insertLearningResource(resource: NewLearningResource) {
  return await db
    .insertInto('learning_resource')
    .values(resource)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteLearningResource(id: string) {
  return await db.deleteFrom('learning_resource').where('id', '=', id).execute()
}

export async function insertLearningCredits(credits: NewLearningCredits) {
  return await db
    .insertInto('learning_credits')
    .values(credits)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteLearningCredits(id: string) {
  return await db.deleteFrom('learning_credits').where('id', '=', id).execute()
}

export async function insertLearningTags(learningTags: NewLearningTags) {
  return await db
    .insertInto('learning_tags')
    .values(learningTags)
    .returningAll()
    .onConflict((oc) => oc.column('learning_id').column('tag_id').doNothing())
    .execute()
}

export async function deleteLearningTag(id: string) {
  return await db.deleteFrom('learning_tags').where('id', '=', id).execute()
}
