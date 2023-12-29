import { db } from '../../config/database'
import { NewEvent, UpdateEvent } from '../../types/DBTypes'

export async function createEvent(body: NewEvent): Promise<NewEvent> {
  return await db
    .insertInto('community_events')
    .values(body)
    .returningAll()
    .executeTakeFirst()
}

export async function findEvents(searchQuery: string) {
  let query = db
    .selectFrom('community_events')
    .selectAll()
    .where('status', '=', true)
    .orderBy('community_events.createdat', 'desc')

  if (searchQuery.length)
    query = query.where(
      'community_events.event_name',
      'ilike',
      `${searchQuery}%`
    )

  return await query.execute()
}

export async function viewEvents(id: string) {
  return await db
    .selectFrom('community_events')
    .selectAll()
    .where('community_events.id', '=', id)
    .groupBy('community_events.id')
    .executeTakeFirst()
}

export async function updateEvents(id: string, event: UpdateEvent) {
  return await db
    .updateTable('community_events')
    .set(event)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteEvents(id: string) {
  return await db
    .updateTable('community_events')
    .set({ status: false })
    .where('id', '=', id)
    .returningAll()
    .execute()
}
