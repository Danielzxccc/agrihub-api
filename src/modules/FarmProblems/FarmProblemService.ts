import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import {
  NewFarmProblem,
  NewFarmProblemMaterial,
  NewFarmProblemReport,
  UpdateFarmProblem,
} from '../../types/DBTypes'
import { sql } from 'kysely'
// import { NewLearningMaterial } from '../../schema/LearningMaterialSchema'

export async function upsertFarmProblem(
  problem: NewFarmProblem,
  materials?: string[] | string
) {
  return await db.transaction().execute(async (trx) => {
    const newProblem = await trx
      .insertInto('farm_problems')
      .values(problem?.id ? { ...problem, updatedat: new Date() } : problem)
      .onConflict((oc) => oc.column('id').doUpdateSet(problem))
      .returningAll()
      .executeTakeFirstOrThrow()

    let createdMaterials
    if (materials?.length) {
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

      createdMaterials = await trx
        .insertInto('farm_problem_materials')
        .values(newMaterials)
        .onConflict((oc) =>
          oc.column('farm_problem_id').column('learning_id').doNothing()
        )
        .returningAll()
        .execute()
    }

    return { newProblem, material: createdMaterials }
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
      'fp.common',
      'fp.is_archived',
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

  return await query
    .where('common', '=', filterKey)
    .where('is_archived', '=', false)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalFarmProblems(
  searchKey?: string,
  filterKey?: boolean
) {
  let query = db
    .selectFrom('farm_problems')
    .select(({ fn }) => [fn.count<number>('id').as('count')])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('description', 'ilike', `${searchKey}%`),
        eb('problem', 'ilike', `${searchKey}%`),
      ])
    )
  }
  if (filterKey) {
    query = query.where('common', '=', filterKey)
  }
  return await query.where('is_archived', '=', false).executeTakeFirst()
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

export async function createReportedProblem(report: NewFarmProblemReport) {
  return await db
    .insertInto('reported_problems')
    .values(report)
    .returningAll()
    .executeTakeFirst()
}

export async function updateReportedProblem(
  id: string,
  report: UpdateFarmProblem
) {
  return await db
    .updateTable('reported_problems')
    .set(report)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findUncommonProblems(problem_id: string) {
  return await db
    .selectFrom('reported_problems')
    .selectAll()
    .where('problem_id', '=', problem_id)
    .where('status', '=', 'pending')
    .execute()
}

export async function findCommunityFarmProblems(
  farmid: string,
  offset: number,
  perpage: number,
  searchKey?: string,
  filterKey?: 'pending' | 'resolved'
) {
  let query = db
    .selectFrom('reported_problems as rp')
    .leftJoin('farm_problems as fp', 'rp.problem_id', 'fp.id')
    .select([
      'rp.id',
      'fp.id as fp_id',
      'rp.status',
      'fp.problem',
      'fp.description',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('fp.description', 'ilike', `${searchKey}%`),
        eb('fp.problem', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filterKey?.length) {
    query = query.where('rp.status', '=', filterKey)
  }

  return await query
    .where('rp.community_farm', '=', farmid)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalCommunityFarmProblems(
  farmid: string,
  filterKey?: 'pending' | 'resolved'
) {
  let query = db
    .selectFrom('reported_problems')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('community_farm', '=', farmid)

  if (filterKey?.length) {
    query = query.where('status', '=', filterKey)
  }

  return await query.executeTakeFirst()
}

export async function findReportedProblems(
  offset: number,
  perpage: number,
  searchKey?: string,
  filterKey?: 'pending' | 'resolved'
) {
  let query = db
    .selectFrom('reported_problems as rp')
    .leftJoin('farm_problems as fp', 'rp.problem_id', 'fp.id')
    .select([
      'rp.id',
      'fp.id as fp_id',
      'rp.status',
      'fp.problem',
      'fp.description',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('fp.description', 'ilike', `${searchKey}%`),
        eb('fp.problem', 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filterKey?.length) {
    query = query.where('rp.status', '=', filterKey)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalReportedProblems(
  filterKey?: 'pending' | 'resolved'
) {
  let query = db
    .selectFrom('reported_problems')
    .select(({ fn }) => [fn.count<number>('id').as('count')])

  if (filterKey?.length) {
    query = query.where('status', '=', filterKey)
  }

  return await query.executeTakeFirst()
}
