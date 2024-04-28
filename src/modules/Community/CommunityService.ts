import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  CommunityCropReport,
  NewApplicationAnswers,
  NewCommunityFarmReport,
  NewCommunityTask,
  NewFarmMemberApplication,
  NewFarmQuestion,
  UpdateCommunityFarmReport,
  UpdateCommunityTask,
  UpdateFarmMemberApplication,
} from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import {
  ListFarmerRequests,
  listPlantedCropReportsT,
} from './CommunityInteractor'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

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
    .selectFrom('farm_member_application')
    .selectAll()
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
}: listPlantedCropReportsT) {
  let query = db
    .selectFrom('community_crop_reports as ccr')
    .leftJoin('community_farms_crops as cfc', 'ccr.crop_id', 'cfc.id')
    .leftJoin('crops as c', 'cfc.crop_id', 'c.id')
    .leftJoin('users as u', 'u.id', 'ccr.harvested_by')
    .select(({ fn, val }) => [
      'ccr.id as report_id',
      'cfc.id as cfc_id',
      'c.name as crop_name',
      'ccr.date_planted',
      'ccr.date_harvested',
      'ccr.harvested_qty',
      'ccr.withered_crops',
      'ccr.planted_qty',
      'ccr.harvested_by',
      'u.firstname',
      'u.lastname',
      'c.growth_span',
      sql`ccr.date_planted + (c.growth_span || ' month')::INTERVAL`.as(
        'expected_harvest_date'
      ),
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
      'ccr.planted_qty',
      'ccr.harvested_by',
      'u.firstname',
      'u.lastname',
    ])
    .where('ccr.farmid', '=', farmid)
    .where('ccr.is_archived', '=', false)

  if (status === 'planted') {
    query = query.where('ccr.date_harvested', 'is', null)
  } else {
    query = query.where('ccr.date_harvested', 'is not', null)
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
