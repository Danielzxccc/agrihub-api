import { IdentifierNode, ToolRequestStatus } from 'kysely-codegen'
import { db } from '../../config/database'
import {
  NewSeedlingRequest,
  NewToolRequest,
  UpdateSeedlingRequest,
  UpdateToolRequest,
} from '../../types/DBTypes'
import { sql } from 'kysely'

export async function insertSeedlingRequest(request: NewSeedlingRequest) {
  return await db
    .insertInto('seedling_requests')
    .values(request)
    .returningAll()
    .executeTakeFirst()
}

export async function updateSeedlingRequest(
  id: string,
  request: UpdateSeedlingRequest
) {
  return await db
    .updateTable('seedling_requests')
    .set(request)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findSeedlingRequest(farmid: string, cropid: string) {
  return await db
    .selectFrom('seedling_requests')
    .selectAll()
    .where('farm_id', '=', farmid)
    .where('crop_id', '=', cropid)
    .where('status', '=', 'pending')
    .executeTakeFirst()
}
export async function findSeedlingRequestById(id: string) {
  return await db
    .selectFrom('seedling_requests')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteSeedlingRequest(id: string) {
  return await db
    .deleteFrom('seedling_requests')
    .where('id', '=', id)
    .where('status', '=', 'pending')
    .executeTakeFirst()
}

export async function findSeedlingRequestByFarm(
  farm_id: string,
  offset: number,
  searchKey: string,
  perpage: number,
  filter: string
) {
  let query = db
    .selectFrom('seedling_requests as sr')
    .leftJoin('crops as c', 'c.id', 'sr.crop_id')
    .leftJoin('community_farms as cf', 'sr.farm_id', 'cf.id')
    .select([
      'sr.id',
      'sr.crop_id',
      'sr.farm_id',
      'sr.other',
      'sr.farm_id',
      'sr.quantity_request',
      'sr.quantity_approve',
      'sr.status',
      'sr.delivery_date',
      'sr.note',
      'sr.createdat',
      'sr.updatedat',
      'sr.note',
      'c.name',
      'cf.farm_name',
    ])
    .where('farm_id', '=', farm_id)
    .orderBy('createdat desc')

  if (filter === 'pending') {
    query = query.where('sr.status', '=', 'pending')
  } else if (filter === 'accepted') {
    query = query.where('sr.status', '=', 'accepted')
    query = query.orderBy('sr.updatedat desc')
  } else if (filter === 'rejected') {
    query = query.where('sr.status', '=', 'rejected')
    query = query.orderBy('sr.createdat desc')
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('c.name', 'ilike', `${searchKey}%`),
        eb('cf.farm_name', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function findAllSeedlingRequest(
  offset: number,
  searchKey: string,
  perpage: number,
  filter: string
) {
  let query = db
    .selectFrom('seedling_requests as sr')
    .leftJoin('crops as c', 'c.id', 'sr.crop_id')
    .leftJoin('community_farms as cf', 'sr.farm_id', 'cf.id')
    .select([
      'sr.id',
      'sr.crop_id',
      'sr.farm_id',
      'sr.other',
      'sr.farm_id',
      'sr.quantity_request',
      'sr.quantity_approve',
      'sr.status',
      'sr.delivery_date',
      'sr.note',
      'sr.createdat',
      'sr.updatedat',
      'sr.note',
      'c.name',
      'cf.farm_name',
    ])

  if (filter === 'pending') {
    query = query.where('sr.status', '=', 'pending')
  } else if (filter === 'accepted') {
    query = query.where('sr.status', '=', 'accepted')
    query = query.orderBy('sr.updatedat desc')
  } else if (filter === 'rejected') {
    query = query.where('sr.status', '=', 'rejected')
    query = query.orderBy('sr.createdat desc')
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('c.name', 'ilike', `${searchKey}%`),
        eb('cf.farm_name', 'ilike', `${searchKey}%`),
        eb(sql`CAST(quantity_request AS TEXT)`, 'ilike', `${searchKey}%`),
      ])
    )
  }
  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalSeedlingRequests(
  searchKey: string,
  filter: string,
  id?: string
) {
  let query = db
    .selectFrom('seedling_requests as sr')
    .leftJoin('crops as c', 'c.id', 'sr.crop_id')
    .leftJoin('community_farms as cf', 'sr.farm_id', 'cf.id')
    .select(({ fn }) => [fn.count<number>('sr.id').as('count')])

  if (filter === 'pending') {
    query = query.where('sr.status', '=', 'pending')
  } else if (filter === 'accepted') {
    query = query.where('sr.status', '=', 'accepted')
  } else if (filter === 'rejected') {
    query = query.where('sr.status', '=', 'rejected')
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('c.name', 'ilike', `${searchKey}%`),
        eb('cf.farm_name', 'ilike', `${searchKey}%`),
        eb(sql`CAST(quantity_request AS TEXT)`, 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (id) {
    query = query.where('farm_id', '=', id)
  }

  return await query.executeTakeFirst()
}

export async function getFarmRequestsCount() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('seedling_requests')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_requests'),
      eb
        .selectFrom('seedling_requests')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'accepted')
        .as('accepted_requests'),
    ])
    .executeTakeFirst()
}

export async function createToolRequest(request: NewToolRequest) {
  return await db
    .insertInto('tool_request')
    .values(request)
    .returningAll()
    .executeTakeFirst()
}

export async function updateToolRequest(
  id: string,
  request: UpdateToolRequest
) {
  return await db
    .updateTable('tool_request')
    .set(request)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findPendingToolRequestsByFarm(farmid: string) {
  return await db
    .selectFrom('tool_request')
    .selectAll()
    .orderBy('createdat desc')
    .limit(3)
    .where('farm_id', '=', farmid)
    .where('status', '=', 'pending')
    .execute()
}

export async function findToolRequests(
  offset: number,
  searchKey: string,
  perpage: number,
  filter: ToolRequestStatus,
  farmid?: string
) {
  let query = db
    .selectFrom('tool_request as tr')
    .innerJoin('community_farms as cf', 'tr.farm_id', 'cf.id')
    .select([
      'tr.id',
      'tr.tool_requested',
      'tr.quantity_requested',
      'tr.status',
      'tr.requester_note',
      'tr.client_note',
      'tr.forwarded_to',
      'tr.accepted_by',
      'tr.contact',
      'tr.farm_id',
      'tr.createdat',
      'tr.updatedat',
      'cf.farm_name',
      'cf.location',
      'cf.description',
      'cf.farm_head',
      'cf.district',
      'cf.size',
      'cf.avatar',
      'cf.cover_photo',
      'cf.application_id',
      'cf.is_archived',
    ])

  if (searchKey?.length) {
    query = query.where((eb) =>
      eb.or([
        eb('tool_requested', 'ilike', `%${searchKey}%`),
        eb('requester_note', 'ilike', `%${searchKey}%`),
        eb('cf.farm_name', 'ilike', `%${searchKey}%`),
        eb(sql`CAST(quantity_requested AS TEXT)`, 'ilike', `%${searchKey}%`),
      ])
    )
  }

  if (filter?.length) {
    query = query.where('tr.status', '=', filter)
  }

  if (farmid) {
    query = query.where('farm_id', '=', farmid)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalToolRequest(
  searchKey: string,
  filter: ToolRequestStatus,
  farmid?: string
) {
  let query = db
    .selectFrom('tool_request as tr')
    .innerJoin('community_farms as cf', 'tr.farm_id', 'cf.id')
    .select(({ fn }) => [fn.count<number>('tr.id').as('count')])

  if (searchKey?.length) {
    query = query.where((eb) =>
      eb.or([
        eb('tool_requested', 'ilike', `%${searchKey}%`),
        eb('requester_note', 'ilike', `%${searchKey}%`),
        eb('cf.farm_name', 'ilike', `%${searchKey}%`),
        eb(sql`CAST(quantity_requested AS TEXT)`, 'ilike', `${searchKey}%`),
      ])
    )
  }

  if (filter?.length) {
    query = query.where('tr.status', '=', filter)
  }

  if (farmid) {
    query = query.where('farm_id', '=', farmid)
  }

  return await query.executeTakeFirst()
}

export async function deleteToolRequest(id: string) {
  return await db
    .deleteFrom('tool_request')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findToolRequestById(id: string) {
  return await db
    .selectFrom('tool_request')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}
