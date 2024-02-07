import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewLearningMaterial,
  UpdateLearningMaterial,
} from '../../types/DBTypes'

export async function findLearningMaterial(id: string) {
  return await db
    .selectFrom('learning_materials')
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
