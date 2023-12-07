import { jsonObjectFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import { NewFarm, NewSubFarm } from '../../types/DBTypes'

export async function findFarm(id: string) {
  return await db
    .selectFrom('farms')
    .selectAll()
    .where('id', '=', id)
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
