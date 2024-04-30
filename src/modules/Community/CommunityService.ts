import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  CommunityCropReport,
  NewApplicationAnswers,
  NewCommunityEvent,
  NewCommunityFarmReport,
  NewCommunityTask,
  NewFarmMemberApplication,
  NewFarmQuestion,
  UpdateCommunityEvent,
  UpdateCommunityFarmReport,
  UpdateCommunityTask,
  UpdateFarmMemberApplication,
} from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import {
  ListCommunityEventsT,
  ListCommunityTasksT,
  ListFarmerRequests,
  listPlantedCropReportsT,
} from './CommunityInteractor'
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres'
import { EventEngagement } from 'kysely-codegen'

export async function createNewFarmQuestion(question: NewFarmQuestion) {
  return await db
    .insertInto('farm_questions')
    .values(question)
    .onConflict((oc) =>
      oc.column('id').doUpdateSet((eb) => ({
        farmid: eb.ref('excluded.farmid'),
        question: eb.ref('excluded.question'),
        updatedat: new Date(),
      }))
    )
    .returningAll()
    .execute()
}

export async function findFarmQuestions(farmid: string) {
  return await db
    .selectFrom('farm_questions')
    .select(['id', 'farmid', 'question'])
    .where('farmid', '=', farmid)
    .execute()
}

export async function findFarmQuestion(id: string) {
  return await db
    .selectFrom('farm_questions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteFarmQuestion(id: string) {
  return await db
    .deleteFrom('farm_questions')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findUserApplication(userid: string) {
  return await db
    .selectFrom('farm_member_application')
    .selectAll()
    .where('userid', '=', userid)
    .where('status', '=', 'pending')
    .executeTakeFirst()
}

export async function createFarmMemberApplication(
  application: NewFarmMemberApplication
) {
  return await db
    .insertInto('farm_member_application')
    .values(application)
    .returningAll()
    .executeTakeFirst()
}

export async function createFarmMemberApplicationAnswers(
  answers: NewApplicationAnswers
) {
  return await db
    .insertInto('application_answers')
    .values(answers)
    .returningAll()
    .executeTakeFirst()
}

export async function listFarmerApplications({
  farmid,
  offset,
  perpage,
  searchKey,
  filter,
}: ListFarmerRequests) {
  let query = db
    .selectFrom('farm_member_application as fa')
    .leftJoin('users as u', 'fa.userid', 'u.id')
    .select(({ fn, val, eb }) => [
      'fa.id',
      'fa.createdat',
      'fa.updatedat',
      'fa.userid',
      'fa.status',
      fn<string>('concat', [val(returnObjectUrl()), 'u.avatar']).as('avatar'),
      'u.lastname',
      'u.username',
      'u.email',
      'u.present_address',
      'u.district',
      jsonArrayFrom(
        eb
          .selectFrom('application_answers as aa')
          .leftJoin('farm_questions as fq', 'fq.id', 'aa.questionid')
          .select(['aa.answer', 'fq.question'])
          .whereRef('aa.applicationid', '=', 'fa.id')
      ).as('answers'),
    ])
    .where('fa.farmid', '=', farmid)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb(sql`CAST(fa.userid as TEXT)`, 'ilike', `%${searchKey}%`),
        eb('u.lastname', 'ilike', `%${searchKey}%`),
        eb('u.firstname', 'ilike', `%${searchKey}%`),
        eb('u.username', 'ilike', `%${searchKey}%`),
        eb('u.email', 'ilike', `%${searchKey}%`),
        eb(sql`CAST(u.district as TEXT)`, 'ilike', `%${searchKey}%`),
        eb('u.present_address', 'ilike', `%${searchKey}%`),
      ])
    )
  }

  if (filter) {
    query = query.where('fa.status', '=', filter)
  }

  return await query
    .orderBy('createdat desc')
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalFarmerApplications({
  farmid,
  searchKey,
  filter,
}: ListFarmerRequests) {
  let query = db
    .selectFrom('farm_member_application as fa')
    .leftJoin('users as u', 'fa.userid', 'u.id')
    .select(({ fn }) => [fn.count<number>('fa.id').as('count')])
    .where('fa.farmid', '=', farmid)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb(sql`CAST(fa.userid as TEXT)`, 'ilike', `%${searchKey}%`),
        eb('u.lastname', 'ilike', `%${searchKey}%`),
        eb('u.firstname', 'ilike', `%${searchKey}%`),
        eb('u.username', 'ilike', `%${searchKey}%`),
        eb('u.email', 'ilike', `%${searchKey}%`),
        eb(sql`CAST(u.district as TEXT)`, 'ilike', `%${searchKey}%`),
        eb('u.present_address', 'ilike', `%${searchKey}%`),
      ])
    )
  }

  if (filter) {
    query = query.where('fa.status', '=', filter)
  }

  return await query.executeTakeFirst()
}

export async function findFarmerApplication(id: string) {
  return await db
    .selectFrom('farm_member_application as fa')
    .select(({ eb }) => [
      'fa.id',
      'fa.farmid',
      'fa.userid',
      'fa.contact_person',
      'fa.proof_selfie',
      'fa.valid_id',
      'fa.reason',
      'fa.createdat',
      'fa.updatedat',
      'fa.status',
      'fa.remarks',
      jsonArrayFrom(
        eb
          .selectFrom('application_answers as aa')
          .leftJoin('farm_questions as fq', 'fq.id', 'aa.questionid')
          .select(['aa.answer', 'fq.question'])
          .whereRef('aa.applicationid', '=', 'fa.id')
      ).as('answers'),
    ])
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function updateFarmerApplication(
  id: string,
  application: UpdateFarmMemberApplication
) {
  return await db
    .updateTable('farm_member_application')
    .set(application)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteFarmerApplication(id: string) {
  return await db
    .deleteFrom('farm_member_application')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function createPlantedReport(report: NewCommunityFarmReport) {
  return await db
    .insertInto('community_crop_reports')
    .values(report)
    .returningAll()
    .executeTakeFirst()
}

export async function updateCropReport(
  id: string,
  report: UpdateCommunityFarmReport
) {
  return await db
    .updateTable('community_crop_reports')
    .set(report)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function listPlantedCropReports({
  farmid,
  filterKey,
  offset,
  perpage,
  searchKey,
  month,
  status,
  order,
}: listPlantedCropReportsT) {
  let query = db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .leftJoin('users as u', 'u.id', 'ccr.harvested_by')
    .select(({ eb, fn, val }) => [
      'ccr.id as report_id',
      'cfc.id as cfc_id',
      'c.name as crop_name',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.batch',
      eb
        .selectFrom('community_crop_reports as ccrp')
        .select(['planted_qty'])
        .whereRef('ccrp.id', '=', 'ccr.last_harvest_id')
        .as('previous_planted_qty'),
      'ccr.harvested_qty',
      'ccr.withered_crops',
      'ccr.planted_qty',
      'ccr.harvested_by',
      'ccr.kilogram',
      'u.firstname',
      'u.lastname',
      'c.growth_span',
      sql`
        CASE 
          WHEN ccr.batch IS NOT NULL THEN ccr.batch + (c.growth_span || ' month')::INTERVAL 
          ELSE ccr.date_planted + (c.growth_span || ' month')::INTERVAL 
        END
      `.as('expected_harvest_date'),
      fn<string>('concat', [val(returnObjectUrl()), 'c.image']).as('image'),
    ])
    .groupBy([
      'ccr.id',
      'cfc.id',
      'c.name',
      'c.image',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
      'ccr.last_harvest_id',
      'ccr.planted_qty',
      'ccr.harvested_by',
      'u.firstname',
      'u.lastname',
    ])
    .where('ccr.farmid', '=', farmid)
    .where('ccr.is_archived', '=', false)

  if (status === 'planted') {
    query = query.where('ccr.date_harvested', 'is', null)
    query = query.orderBy('ccr.date_planted', order)
  } else {
    query = query.where('ccr.date_harvested', 'is not', null)
    query = query.orderBy('ccr.createdat', order)
  }

  if (month.length) {
    query = query.where(sql`EXTRACT(MONTH FROM ccr.date_planted) = ${month}`)
  }

  if (filterKey.length) {
    if (typeof filterKey === 'string') {
      query = query.where('c.name', 'ilike', `${filterKey}%`)
    } else {
      query = query.where((eb) =>
        eb.or(filterKey.map((item) => eb('c.name', 'ilike', `${item}%`)))
      )
    }
  }

  if (searchKey.length) {
    query = query.where('c.name', 'ilike', `${searchKey}%`)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalPlantedReports({
  farmid,
  filterKey,
  month,
  searchKey,
  status,
}: listPlantedCropReportsT) {
  let query = db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .select(({ fn }) => [fn.count<number>('ccr.id').as('count')])
    .where('ccr.farmid', '=', farmid)
    .where('ccr.is_archived', '=', false)

  if (status === 'planted') {
    query = query.where('ccr.date_harvested', 'is', null)
  } else {
    query = query.where('ccr.date_harvested', 'is not', null)
  }

  if (filterKey.length) {
    if (typeof filterKey === 'string') {
      query = query.where('c.name', 'ilike', `${filterKey}%`)
    } else {
      query = query.where((eb) =>
        eb.or(filterKey.map((item) => eb('c.name', 'ilike', `${item}%`)))
      )
    }
  }

  if (month.length) {
    query = query.where(sql`EXTRACT(MONTH FROM ccr.date_harvested) = ${month}`)
  }

  if (searchKey.length) {
    query = query.where('c.name', 'ilike', `${searchKey}%`)
  }

  return await query.executeTakeFirst()
}

export async function createCommunityTask(task: NewCommunityTask) {
  return await db
    .insertInto('community_tasks')
    .values(task)
    .returningAll()
    .executeTakeFirst()
}

export async function findPendingCommunityTask(id: string) {
  return await db
    .selectFrom('community_tasks')
    .selectAll()
    .where('id', '=', id)
    .where('status', '=', 'pending')
    .executeTakeFirst()
}

export async function findHarvestingCommunityTask(report_id: string) {
  return await db
    .selectFrom('community_tasks')
    .selectAll()
    .where('report_id', '=', report_id)
    .executeTakeFirst()
}

export async function updateCommunityTask(
  id: string,
  task: UpdateCommunityTask
) {
  return await db
    .updateTable('community_tasks')
    .set(task)
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function listCommunityTasks({
  farmid,
  userid,
  filter,
  type,
  offset,
  perpage,
  searchKey,
}: ListCommunityTasksT) {
  let query = db
    .selectFrom('community_tasks as ct')
    .leftJoin('community_farms_crops as cfc', 'cfc.id', 'ct.crop_id')
    .leftJoin('crops as c', 'c.id', 'cfc.crop_id')
    .leftJoin('users as u', 'u.id', 'ct.assigned_to')
    .select(({ eb }) => [
      'ct.id',
      'ct.farmid',
      'ct.assigned_to',
      'ct.report_id',
      'ct.crop_id',
      'ct.due_date',
      'ct.task_type',
      'ct.message',
      'ct.action_message',
      'ct.status',
      'c.name as crop_name',
      'u.username',
      'u.firstname',
      'u.lastname',
      'u.role',
    ])
    .where('farmid', '=', farmid)

  if (userid) {
    query = query.where('ct.assigned_to', '=', userid)
  }

  if (filter) {
    query = query.where('ct.status', '=', filter)
  }

  if (type) {
    query = query.where('ct.task_type', '=', type)
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb(sql`CAST(ct.task_type AS TEXT)`, 'ilike', `%${searchKey}%`),
        eb('ct.message', 'ilike', `%${searchKey}%`),
        eb('ct.action_message', 'ilike', `%${searchKey}%`),
        eb('ct.message', 'ilike', `%${searchKey}%`),
        eb('u.username', 'ilike', `%${searchKey}%`),
        eb('u.firstname', 'ilike', `%${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalCommunityTasks({
  farmid,
  userid,
  filter,
  searchKey,
  type,
}: ListCommunityTasksT) {
  let query = db
    .selectFrom('community_tasks as ct')
    .leftJoin('users as u', 'u.id', 'ct.assigned_to')
    .select(({ fn }) => [fn.count<number>('ct.id').as('count')])
    .where('farm_id', '=', farmid)

  if (userid) {
    query = query.where('ct.assigned_to', '=', userid)
  }

  if (filter) {
    query = query.where('ct.status', '=', filter)
  }

  if (type) {
    query = query.where('ct.task_type', '=', type)
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb(sql`CAST(ct.task_type AS TEXT)`, 'ilike', `%${searchKey}%`),
        eb('ct.message', 'ilike', `%${searchKey}%`),
        eb('ct.action_message', 'ilike', `%${searchKey}%`),
        eb('ct.message', 'ilike', `%${searchKey}%`),
        eb('u.username', 'ilike', `%${searchKey}%`),
        eb('u.firstname', 'ilike', `%${searchKey}%`),
      ])
    )
  }
  return await query.executeTakeFirst()
}

export async function deleteCommunityTask(id: string) {
  return await db
    .deleteFrom('community_tasks')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function createCommunityEvent(
  event: NewCommunityEvent,
  tagsId: string[] | string
) {
  const communityEvent = await db.transaction().execute(async (trx) => {
    const insertedEvent = await trx
      .insertInto('community_events')
      .values(event)
      .returningAll()
      .executeTakeFirst()

    let tagRecords
    if (Array.isArray(tagsId) && tagsId.length > 0) {
      tagRecords = tagsId.map((tagName) => ({
        eventid: insertedEvent.id,
        tagid: tagName,
      }))
    } else if (typeof tagsId === 'string') {
      tagRecords = {
        eventid: insertedEvent.id,
        tagid: tagsId,
      }
    }

    let tags:
      | { id: string; eventid: string; tagid: string }
      | { id: string; eventid: string; tagid: string }[] = []
    if (tagRecords?.length || tagRecords) {
      tags = await trx
        .insertInto('community_events_tags')
        .values(tagRecords)
        .returningAll()
        .executeTakeFirst()
    }

    return { insertedEvent: event, tags }
  })

  return communityEvent
}

export async function listCommunityEventsByFarm({
  farmid,
  searchKey,
  offset,
  perpage,
  type,
  filter,
  userid,
}: ListCommunityEventsT) {
  let query = db
    .selectFrom('community_events as ce')
    .leftJoin('community_farms as cf', 'cf.id', 'ce.farmid')
    .select(({ eb, fn, val }) => [
      'ce.id',
      'ce.farmid',
      'ce.title',
      'ce.about',
      fn<string>('concat', [val(returnObjectUrl()), 'ce.banner']).as('banner'),
      'ce.start_date',
      'ce.end_date',
      'ce.type',
      'ce.createdat',
      'ce.updatedat',
      'cf.farm_name',
      eb
        .selectFrom('user_event_engagement as ue')
        .select(({ fn }) =>
          fn
            .count<number>('id')
            .distinct()
            .filterWhere('ue.type', '=', 'going')
            .as('going')
        )
        .whereRef('ue.eventid', '=', 'ce.id')
        .as('going'),
      eb
        .selectFrom('user_event_engagement as ue')
        .select(({ fn }) =>
          fn
            .count<number>('id')
            .distinct()
            .filterWhere('ue.type', '=', 'interested')
            .as('interested')
        )
        .whereRef('ue.eventid', '=', 'ce.id')
        .as('interested'),
      jsonArrayFrom(
        eb
          .selectFrom('community_events_tags as cet')
          .leftJoin('tags', 'cet.tagid', 'tags.id')
          .select([
            'tags.tag_name as tag',
            sql<string>`CAST(tags.id AS TEXT)`.as('id'),
          ])
          .whereRef('cet.eventid', '=', 'ce.id')
          .groupBy(['ce.id', 'tags.id', 'cet.eventid', 'tags.tag_name'])
          .orderBy('ce.id')
      ).as('tags'),
      jsonObjectFrom(
        eb
          .selectFrom('user_event_engagement as ue')
          .select([sql<string>`CAST(ue.id AS TEXT)`.as('id'), 'type'])
          .where('ue.userid', '=', userid)
          .whereRef('ce.id', '=', 'ue.eventid')
      ).as('action'),
    ])
    .distinct()

  if (farmid) {
    query = query.where('ce.farmid', '=', farmid)
  } else {
    query = query.where('ce.type', '=', 'public')
  }

  if (filter === 'upcoming') {
    query = query.where('ce.start_date', '>', new Date())
    query = query.orderBy('ce.end_date')
  } else if (filter === 'previous') {
    query = query.where('ce.start_date', '<', new Date())
    query = query.orderBy('ce.end_date')
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('ce.title', 'ilike', `%${searchKey}%`),
        eb('ce.about', 'ilike', `%${searchKey}%`),
      ])
    )
  }

  if (type) {
    query = query.where('ce.type', '=', type)
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalCommunityEventsByFarm({
  farmid,
  searchKey,
  type,
  filter,
}: ListCommunityEventsT) {
  let query = db
    .selectFrom('community_events as ce')
    .select(({ fn }) => [fn.count<number>('ce.id').as('count')])

  if (farmid) {
    query = query.where('ce.farmid', '=', farmid)
  } else {
    query = query.where('ce.type', '=', 'public')
  }

  if (filter === 'upcoming') {
    query = query.where('ce.start_date', '>', new Date())
  } else if (filter === 'previous') {
    query = query.where('ce.start_date', '<', new Date())
  }

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('ce.title', 'ilike', `%${searchKey}%`),
        eb('ce.about', 'ilike', `%${searchKey}%`),
      ])
    )
  }

  if (type) {
    query = query.where('ce.type', '=', type)
  }

  return await query.executeTakeFirst()
}

export async function findCommunityEventTags(id: string) {
  return await db
    .selectFrom('community_events_tags')
    .selectAll()
    .where('eventid', '=', id)
    .execute()
}

export async function updateCommunityEvent(
  id: string,
  event: UpdateCommunityEvent,
  tagsId: string[] | string,
  deletedTags: string[] | string
) {
  const updateCommunityEvent = await db.transaction().execute(async (trx) => {
    const updatedEvent = await trx
      .updateTable('community_events')
      .set(event)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()

    let tagRecords
    if (Array.isArray(tagsId) && tagsId.length > 0) {
      tagRecords = tagsId.map((tagName) => ({
        eventid: updatedEvent.id,
        tagid: tagName,
      }))
    } else if (typeof tagsId === 'string') {
      tagRecords = {
        eventid: updatedEvent.id,
        tagid: tagsId,
      }
    }

    if (deletedTags.length) {
      await db
        .deleteFrom('community_events_tags')
        .where('eventid', '=', id)
        .where('tagid', 'in', deletedTags)
        .execute()
    }

    if (tagRecords?.length || tagRecords) {
      await trx
        .insertInto('community_events_tags')
        .values(tagRecords)
        .onConflict((oc) => oc.column('tagid').column('eventid').doNothing())
        .returningAll()
        .executeTakeFirst()
    }

    return updatedEvent
  })

  return updateCommunityEvent
}

export async function findCommunityEvent(id: string) {
  return await db
    .selectFrom('community_events')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteCommunityEvent(id: string) {
  return await db
    .deleteFrom('community_events')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function viewCommunityEvent(id: string, userid: string) {
  return await db
    .selectFrom('community_events as ce')
    .leftJoin('community_farms as cf', 'cf.id', 'ce.farmid')
    .select(({ eb, fn, val }) => [
      'ce.id',
      'ce.farmid',
      'ce.title',
      'ce.about',
      fn<string>('concat', [val(returnObjectUrl()), 'ce.banner']).as('banner'),
      'ce.start_date',
      'ce.end_date',
      'ce.type',
      'ce.createdat',
      'ce.updatedat',
      'cf.farm_name',
      eb
        .selectFrom('user_event_engagement as ue')
        .select(({ fn }) =>
          fn
            .count<number>('id')
            .distinct()
            .filterWhere('ue.type', '=', 'going')
            .as('going')
        )
        .whereRef('ue.eventid', '=', 'ce.id')
        .as('going'),
      eb
        .selectFrom('user_event_engagement as ue')
        .select(({ fn }) =>
          fn
            .count<number>('id')
            .distinct()
            .filterWhere('ue.type', '=', 'interested')
            .as('interested')
        )
        .whereRef('ue.eventid', '=', 'ce.id')
        .as('interested'),
      jsonArrayFrom(
        eb
          .selectFrom('community_events_tags as cet')
          .leftJoin('tags', 'cet.tagid', 'tags.id')
          .select([
            'tags.tag_name as tag',
            sql<string>`CAST(tags.id AS TEXT)`.as('id'),
          ])
          .whereRef('cet.eventid', '=', 'ce.id')
          .groupBy(['ce.id', 'tags.id', 'cet.eventid', 'tags.tag_name'])
          .orderBy('ce.id')
      ).as('tags'),
      jsonObjectFrom(
        eb
          .selectFrom('user_event_engagement as ue')
          .select([sql<string>`CAST(ue.id AS TEXT)`.as('id'), 'type'])
          .where('ue.userid', '=', userid)
          .whereRef('ce.id', '=', 'ue.eventid')
      ).as('action'),
    ])
    .where('ce.id', '=', id)
    .executeTakeFirst()
}

export async function findUsersWithTags(tagid: string[]) {
  return await db
    .selectFrom('user_tags')
    .selectAll()
    .where('tagid', 'in', tagid)
    .execute()
}

export async function eventAction(
  eventid: string,
  userid: string,
  action: EventEngagement
) {
  return await db
    .insertInto('user_event_engagement')
    .values({
      eventid,
      userid,
      type: action,
    })
    .onConflict((oc) =>
      oc
        .column('eventid')
        .column('userid')
        .doUpdateSet({
          type: action,
          updatedat: sql`CURRENT_TIMESTAMP`,
        })
    )
    .returningAll()
    .executeTakeFirst()
}
