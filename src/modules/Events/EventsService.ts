import { db } from '../../config/database'
import { NewEvent, UpdateEvent } from '../../types/DBTypes'

export async function findEventById(id: string) {
  return await db
    .selectFrom('events')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function insertNewEvent(event: NewEvent) {
  return await db
    .insertInto('events')
    .values(event)
    // .onConflict((oc) => oc.column('id').doUpdateSet(event))
    .returningAll()
    .executeTakeFirst()
}

export async function updateEvent(id: string, event: UpdateEvent) {
  return await db
    .updateTable('events')
    .set(event)
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}
