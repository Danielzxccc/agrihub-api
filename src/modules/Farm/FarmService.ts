import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import {
  Crop,
  NewCrop,
  NewCropReport,
  NewFarm,
  NewSubFarm,
  UpdateCrop,
} from '../../types/DBTypes'
import { Crops } from 'kysely-codegen'
import { sql } from 'kysely'

export async function findFarm(id: string) {
  return await db
    .selectFrom('farms')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findSubFarm(id: string) {
  return await db
    .selectFrom('sub_farms')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findSubFarmByHead(id: string) {
  return await db
    .selectFrom('sub_farms')
    .selectAll()
    .where('farm_head', '=', id)
    .executeTakeFirst()
}

export async function getTotalCount() {
  return await db
    .selectFrom('farms')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}
export async function listFarms(
  offset: number,
  searchQuery: string,
  perpage: number
) {
  let query = db.selectFrom('farms').selectAll()
  if (searchQuery.length)
    query = query.where('farms.name', 'ilike', `${searchQuery}%`)

  return await query.limit(perpage).offset(offset).execute()
}

export async function findAllCrops() {
  return await db.selectFrom('crops').selectAll().execute()
}

export async function viewFarm(id: string) {
  return await db
    .selectFrom('farms')
    .leftJoin('sub_farms', 'farms.id', 'sub_farms.farmid')
    .select(({ fn, eb }) => [
      'farms.id',
      'farms.name',
      'location',
      'size',
      'farms.farm_head',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select(['avatar', 'username', 'id'])
          .whereRef('farms.farm_head', '=', 'users.id')
      ).as('farm_head'),
      'district',
      'createdat',
      'updatedat',
      fn.count<number>('sub_farms.id').as('registered_subfarms'),
    ])
    .where('farms.id', '=', id)
    .groupBy('farms.id')
    .executeTakeFirst()
}

export async function createFarm(farm: NewFarm) {
  return await db
    .insertInto('farms')
    .values(farm)
    .returningAll()
    .executeTakeFirst()
}

export async function createSubFarm(subFarm: NewSubFarm) {
  return await db
    .insertInto('sub_farms')
    .values(subFarm)
    .returningAll()
    .executeTakeFirst()
}

export async function viewSubFarm(id: string, searchByHead?: boolean) {
  let query = db.selectFrom('sub_farms').select((eb) => [
    'sub_farms.id',
    'sub_farms.name',
    jsonObjectFrom(
      eb
        .selectFrom('farms')
        .select([
          'avatar',
          'cover_photo',
          'createdat',
          'description',
          'district',
          sql<string>`CAST(id AS TEXT)`.as('id'),
          'location',
          'name',
          'size',
          'updatedat',
        ])
        .whereRef('sub_farms.farmid', '=', 'farms.id')
    ).as('farm'),
  ])

  if (searchByHead) {
    query = query.where('farm_head', '=', id)
  } else {
    query = query.where('id', '=', id)
  }

  return await query.executeTakeFirstOrThrow()
}

export async function findMember(id: string) {
  return await db
    .selectFrom('farm_members')
    .selectAll()
    .where('userid', '=', id)
    .executeTakeFirst()
}

// crops
export async function createCrop(crop: NewCrop) {
  return await db
    .insertInto('crops')
    .values(crop)
    .returningAll()
    .executeTakeFirst()
}

export async function findCrop(id: string) {
  return await db.selectFrom('crops').selectAll().where('id', '=', id).execute()
}

export async function findCropByName(name: string) {
  return await db
    .selectFrom('crops')
    .selectAll()
    .where('name', '=', name)
    .executeTakeFirst()
}

export async function listCrops(): Promise<Crop[]> {
  return await db.selectFrom('crops').selectAll().execute()
}

export async function updateCrop(crop: UpdateCrop, id: string) {
  return await db
    .updateTable('crops')
    .set(crop)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function createCropReport(crop: NewCropReport) {
  return await db
    .insertInto('crop_reports')
    .values(crop)
    .returningAll()
    .executeTakeFirst()
}

export async function listCropReports(farmid: string, isHarvested = false) {
  return await db
    .selectFrom('crop_reports')
    .selectAll()
    .where('farmid', '=', farmid)
    .where('isharvested', '=', isHarvested)
    .execute()
}
