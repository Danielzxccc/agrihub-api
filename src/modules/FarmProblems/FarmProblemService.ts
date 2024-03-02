import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import {
  NewFarmProblem,
  NewFarmProblemMaterial,
  UpdateFarmProblem,
} from '../../types/DBTypes'
import { sql } from 'kysely'

export async function upsertFarmProblem(
  problem: NewFarmProblem,
  materials: string[] | string
) {
  return await db.transaction().execute(async (trx) => {
    const newProblem = await trx
      .insertInto('farm_problems')
      .values(problem?.id ? { ...problem, updatedat: new Date() } : problem)
      .onConflict((oc) => oc.column('id').doUpdateSet(problem))
      .returningAll()
      .executeTakeFirstOrThrow()

    let newMaterials: NewFarmProblemMaterial[] | NewFarmProblemMaterial

    if (Array.isArray(materials)) {
      newMaterials = materials.map((item) => {
        return {
          farm_problem_id: newProblem.id,
          learning_id: item,
        }
      })
    } else {
      newMaterials = {
        farm_problem_id: newProblem.id,
        learning_id: materials,
      }
    }

    await trx
      .insertInto('farm_problem_materials')
      .values(newMaterials)
      .onConflict((oc) =>
        oc.column('farm_problem_id').column('learning_id').doNothing()
      )
      .returningAll()
      .executeTakeFirst()

    return newProblem
  })
}

export async function viewFarmProblem(id: string) {
  return await db
    .selectFrom('farm_problems as fp')
    .select(({ eb }) => [
      'fp.id',
      'fp.problem',
      'fp.description',
      'fp.createdat',
      'fp.updatedat',
      jsonArrayFrom(
        eb
          .selectFrom('farm_problem_materials as fpm')
          .leftJoin('learning_materials as lm', 'fpm.learning_id', 'lm.id')
          .select(({ eb }) => [
            sql<string>`CAST(fpm.id AS TEXT)`.as('fpm_id'),
            sql<string>`CAST(lm.id AS TEXT)`.as('id'),
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
            ).as('thumbnail'),
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
          .whereRef('fp.id', '=', 'fpm.farm_problem_id')
      ).as('learning_materials'),
    ])
    .where('fp.id', '=', id)
    .executeTakeFirst()
}

export async function updateProblem(id: string, problem: UpdateFarmProblem) {
  return await db
    .updateTable('farm_problems')
    .set(problem)
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteFarmProblemMaterial(id: string) {
  return await db
    .deleteFrom('farm_problem_materials')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findFarmProblems(
  offset: number,
  perpage: number,
  searchKey?: string,
  filterKey?: boolean
) {
  let query = db.selectFrom('farm_problems as fp').selectAll()

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('fp.description', 'ilike', `${searchKey}%`),
        eb('fp.problem', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filterKey) {
    query = query.where('common', '=', false)
  }

  return await query
    .where('is_archived', '=', false)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalFarmProblems() {
  return await db
    .selectFrom('farm_problems')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('is_archived', '=', false)
    .executeTakeFirst()
}

export async function findArchivedFarmProblems(
  offset: number,
  perpage: number,
  searchKey?: string,
  filterKey?: boolean
) {
  let query = db.selectFrom('farm_problems as fp').selectAll()

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('fp.description', 'ilike', `${searchKey}%`),
        eb('fp.problem', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filterKey) {
    query = query.where('common', '=', false)
  }

  return await query
    .where('is_archived', '=', true)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalFarmArchivedProblems() {
  return await db
    .selectFrom('farm_problems')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('is_archived', '=', true)
    .executeTakeFirst()
}