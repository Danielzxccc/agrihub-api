import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewLearningCredits,
  NewLearningMaterial,
  NewLearningResource,
  NewLearningTags,
  UpdateLearningMaterial,
  UpdateLearningResource,
} from '../../types/DBTypes'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'

export async function findLearningMaterialDetails(id: string) {
  let query = db
    .selectFrom('learning_materials as lm')
    .select(({ eb }) => [
      'lm.id',
      'lm.title',
      'lm.content',
      'lm.type',
      'lm.language',
      'lm.status',
      'lm.published_date',
      'lm.createdat',
      'lm.updatedat',
      jsonArrayFrom(
        eb
          .selectFrom('learning_resource as lr')
          .select([
            sql<string>`CAST(lr.id AS TEXT)`.as('id'),
            sql<string>`CAST(lr.learning_id AS TEXT)`.as('learning_id'),
            'lr.name',
            'lr.description',
            'lr.resource',
            'lr.type',
            'lr.is_featured',
          ])
          .whereRef('lr.learning_id', '=', 'lm.id')
      ).as('learning_resource'),
      jsonArrayFrom(
        eb
          .selectFrom('learning_credits as lc')
          .select([
            sql<string>`CAST(lc.id AS TEXT)`.as('id'),
            sql<string>`CAST(lc.learning_id AS TEXT)`.as('learning_id'),
            'lc.name',
            'lc.title',
          ])
          .whereRef('lc.learning_id', '=', 'lm.id')
      ).as('learning_credits'),
      jsonArrayFrom(
        eb
          .selectFrom('learning_tags as lt')
          .leftJoin('tags', 'lt.tag_id', 'tags.id')
          .select([
            'tags.tag_name as tag',
            sql<string>`CAST(lt.id AS TEXT)`.as('id'),
          ])
          .whereRef('lt.learning_id', '=', 'lm.id')
          .groupBy(['lt.id', 'lt.learning_id', 'tags.tag_name'])
          .orderBy('lt.id')
      ).as('tags'),
    ])
    .where('id', '=', id)

  return await query.executeTakeFirst()
}

export async function findLearningMaterialByTags(tags: string[]) {
  return await db
    .selectFrom('learning_materials as lm')
    .selectAll()
    .leftJoin('learning_tags as lt', 'lm.id', 'lt.learning_id')
    .leftJoin('tags as t', 'lt.tag_id', 't.id')
    .where('lm.status', '=', 'published')
    .where('is_archived', '=', false)
    .where((eb) => eb.or(tags.map((item) => eb('t.tag_name', '=', item))))
    .execute()
}

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
    .values({ ...material, published_date: null })
    .returningAll()
    .executeTakeFirst()
}

export async function updateLearningMaterial(
  id: string,
  material: UpdateLearningMaterial
) {
  return await db
    .updateTable('learning_materials')
    .set({ ...material, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function publishLearningMaterial(
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

export async function updateLearningResource(
  id: string,
  resource: UpdateLearningResource
) {
  return await db
    .updateTable('learning_resource')
    .set(resource)
    .returningAll()
    .where('id', '=', id)
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

export async function updateLearningCredits(
  id: string,
  resource: UpdateLearningResource
) {
  return await db
    .updateTable('learning_credits')
    .set(resource)
    .returningAll()
    .where('id', '=', id)
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

export async function findDraftLearningMaterials(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('learning_materials')
    .selectAll()
    .where('status', '=', 'draft')
    .where('is_archived', '=', false)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('content', 'ilike', `${searchKey}%`),
        eb('title', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalDraftLearningMaterials() {
  return await db
    .selectFrom('learning_materials')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('status', '=', 'draft')
    .executeTakeFirst()
}

export async function findPublishedLearningMaterials(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('learning_materials as lm')
    .select(({ eb }) => [
      'lm.id',
      'lm.title',
      'lm.content',
      'lm.type',
      'lm.language',
      'lm.status',
      'lm.published_date',
      'lm.is_archived',
      'lm.createdat',
      'lm.updatedat',
      jsonObjectFrom(
        eb
          .selectFrom('learning_resource as lr')
          .select([
            sql<string>`CAST(lr.id AS TEXT)`.as('id'),
            'lr.resource',
            'lr.type',
          ])
          .whereRef('lm.id', '=', 'lr.learning_id')
          .where('is_featured', '=', true)
      ).as('thumnail'),
      jsonArrayFrom(
        eb
          .selectFrom('learning_tags as lt')
          .leftJoin('tags as t', 'lt.tag_id', 't.id')
          .select(['t.tag_name as tag'])
          .whereRef('lt.learning_id', '=', 'lm.id')
          .groupBy(['lt.id', 't.tag_name'])
          .orderBy('lt.id')
      ).as('tags'),
    ])
    .where('status', '=', 'published')
    .where('is_archived', '=', false)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('content', 'ilike', `${searchKey}%`),
        eb('title', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalPublishedLearningMaterials() {
  return await db
    .selectFrom('learning_materials')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('status', '=', 'published')
    .executeTakeFirst()
}

export async function setLearningResourceAsFeatured(
  learningid: string,
  id: string
) {
  return await db
    .updateTable('learning_resource')
    .set({ is_featured: true })
    .where('id', '=', id)
    .where('learning_id', '=', learningid)
    .returningAll()
    .executeTakeFirst()
}

export async function setIsFeaturedToFalse(learningid: string, id: string) {
  return await db
    .updateTable('learning_resource')
    .set({ is_featured: false })
    .where('id', '!=', id)
    .where('learning_id', '=', learningid)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteLearningMaterial(id: string) {
  return await db
    .deleteFrom('learning_materials')
    .where('id', '=', id)
    .execute()
}

export async function findArchivedLearningMaterials(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('learning_materials')
    .selectAll()
    .where('is_archived', '=', true)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('content', 'ilike', `${searchKey}%`),
        eb('title', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalArchivedLearningMaterials() {
  return await db
    .selectFrom('learning_materials')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('status', '=', 'draft')
    .executeTakeFirst()
}
