import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import {
  NewEvent,
  NewEventPartnership,
  NewEventSpeaker,
  NewEventTag,
  UpdateEvent,
  UpdateEventPartnership,
  UpdateEventSpeaker,
} from '../../types/DBTypes'
import { sql } from 'kysely'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'

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

export async function deleteEvent(id: string) {
  return await db
    .deleteFrom('events')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function insertNewEventPartnership(
  partnership: NewEventPartnership
) {
  return await db
    .insertInto('event_partnership')
    .values(partnership)
    .returningAll()
    .executeTakeFirst()
}

export async function updateEventPartnership(
  id: string,
  partnership: UpdateEventPartnership
) {
  return await db
    .updateTable('event_partnership')
    .set(partnership)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteEventPartnership(id: string) {
  return await db
    .deleteFrom('event_partnership')
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findEventPartnership(id: string) {
  return await db
    .selectFrom('event_partnership')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function insertEventSpeaker(speaker: NewEventSpeaker) {
  return await db
    .insertInto('event_speaker')
    .values(speaker)
    .returningAll()
    .executeTakeFirst()
}

export async function updateEventSpeaker(
  id: string,
  speaker: UpdateEventSpeaker
) {
  return await db
    .updateTable('event_speaker')
    .set(speaker)
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteEventSpeaker(id: string) {
  return await db
    .deleteFrom('event_speaker')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findEventSpeaker(id: string) {
  return await db
    .selectFrom('event_speaker')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function inserEventsTags(eventTags: NewEventTag) {
  return await db
    .insertInto('event_tags')
    .values(eventTags)
    .returningAll()
    .onConflict((oc) => oc.column('event_id').column('tag_id').doNothing())
    .execute()
}

export async function deleteEventTag(id: string) {
  return await db.deleteFrom('event_tags').where('id', '=', id).execute()
}

export async function findUnpublishedEvent(id: string) {
  return await db
    .selectFrom('events as e')
    .select(({ eb }) => [
      'e.id',
      'e.banner',
      'e.event_start',
      'e.event_end',
      'e.location',
      'e.title',
      'e.about',
      'e.is_archived',
      'e.status',
      'e.guide',
      'e.published_date',
      'e.createdat',
      'e.updatedat',
      'e.type',
      jsonArrayFrom(
        eb
          .selectFrom('event_partnership as ep')
          .select(({ fn, val }) => [
            sql<string>`CAST(ep.id AS TEXT)`.as('id'),
            'ep.name',
            fn<string>('concat', [val(returnObjectUrl()), 'ep.logo']).as(
              'logo'
            ),
            'ep.organizer',
            'ep.type',
          ])
          .whereRef('ep.event_id', '=', 'e.id')
      ).as('partnership'),
      jsonArrayFrom(
        eb
          .selectFrom('event_speaker as es')
          .select(({ fn, val }) => [
            sql<string>`CAST(es.id AS TEXT)`.as('id'),
            fn<string>('concat', [val(returnObjectUrl()), 'es.profile']).as(
              'profile'
            ),
            'es.name',
            'es.title',
          ])
          .whereRef('es.event_id', '=', 'e.id')
      ).as('speaker'),
      jsonArrayFrom(
        eb
          .selectFrom('event_tags as et')
          .leftJoin('tags as t', 'et.tag_id', 't.id')
          .select([
            sql<string>`CAST(et.id AS TEXT)`.as('id'),
            't.tag_name as tag',
          ])
          .whereRef('et.event_id', '=', 'e.id')
          .groupBy(['et.id', 't.tag_name'])
          .orderBy('et.id')
      ).as('tags'),
    ])
    .where('e.id', '=', id)
    .executeTakeFirst()
}

export async function findPublishedEvent(id: string) {
  return await db
    .selectFrom('events as e')
    .select(({ eb, fn, val }) => [
      'e.id',
      fn<string>('concat', [val(returnObjectUrl()), 'e.banner']).as('banner'),
      'e.event_start',
      'e.event_end',
      'e.location',
      'e.title',
      'e.about',
      'e.is_archived',
      'e.status',
      'e.guide',
      'e.published_date',
      'e.createdat',
      'e.updatedat',
      'e.type',
      jsonArrayFrom(
        eb
          .selectFrom('event_partnership as ep')
          .select(({ fn, val }) => [
            sql<string>`CAST(ep.id AS TEXT)`.as('id'),
            'ep.name',
            fn<string>('concat', [val(returnObjectUrl()), 'ep.logo']).as(
              'logo'
            ),
            'ep.organizer',
            'ep.type',
          ])
          .whereRef('ep.event_id', '=', 'e.id')
      ).as('partnership'),
      jsonArrayFrom(
        eb
          .selectFrom('event_speaker as es')
          .select(({ fn, val }) => [
            sql<string>`CAST(es.id AS TEXT)`.as('id'),
            fn<string>('concat', [val(returnObjectUrl()), 'es.profile']).as(
              'profile'
            ),
            'es.name',
            'es.title',
          ])
          .whereRef('es.event_id', '=', 'e.id')
      ).as('speaker'),
      jsonArrayFrom(
        eb
          .selectFrom('event_tags as et')
          .leftJoin('tags as t', 'et.tag_id', 't.id')
          .select([
            sql<string>`CAST(et.id AS TEXT)`.as('id'),
            't.tag_name as tag',
          ])
          .whereRef('et.event_id', '=', 'e.id')
          .groupBy(['et.id', 't.tag_name'])
          .orderBy('et.id')
      ).as('tags'),
    ])
    .where('e.id', '=', id)
    .where('e.status', '=', 'published')
    .where('e.is_archived', '=', false)
    .executeTakeFirst()
}

export async function findDraftEvents(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('events')
    .selectAll()
    .where('status', '=', 'draft')
    .where('is_archived', '=', false)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('about', 'ilike', `${searchKey}%`),
        eb('title', 'ilike', `${searchKey}%`),
        eb('location', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function findArchivedEvents(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('events')
    .selectAll()
    .where('is_archived', '=', true)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('about', 'ilike', `${searchKey}%`),
        eb('title', 'ilike', `${searchKey}%`),
        eb('location', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalArchiveEvents() {
  return await db
    .selectFrom('events')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('is_archived', '=', true)
    .executeTakeFirst()
}

export async function getTotalDraftEvents() {
  return await db
    .selectFrom('events')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('status', '=', 'draft')
    .where('is_archived', '=', false)
    .executeTakeFirst()
}

export async function archiveEvent(id: string) {
  return await db
    .updateTable('events')
    .set({ is_archived: true })
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function unarchiveEvent(id: string) {
  return await db
    .updateTable('events')
    .set({ is_archived: false })
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findPublishedEvents(
  offset: number,
  searchKey: string,
  perpage: number,
  filter: string
) {
  let query = db
    .selectFrom('events')
    .selectAll()
    .where('status', '=', 'published')
    .where('is_archived', '=', false)

  if (filter === 'upcoming') {
    query = query.where('events.createdat', '>', new Date())
  } else if (filter === 'previous') {
    query = query.where('events.createdat', '<', new Date())
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('about', 'ilike', `${searchKey}%`),
        eb('title', 'ilike', `${searchKey}%`),
        eb('location', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalPublishedEvents() {
  return await db
    .selectFrom('events')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('status', '=', 'published')
    .where('is_archived', '=', true)
    .executeTakeFirst()
}
