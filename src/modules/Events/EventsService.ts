import { db } from '../../config/database'
import { NewEvents, UpdateEvents } from '../../types/DBTypes'

export async function insertNewEvent(event: NewEvents) {
  return await db
    .insertInto('events')
    .values(event)
    // .onConflict((oc) => oc.column('id').doUpdateSet(event))
    .returningAll()
    .executeTakeFirst()
}

export async function updateEvent(id: string, event: UpdateEvents) {
  return await db
    .updateTable('events')
    .set(event)
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}
