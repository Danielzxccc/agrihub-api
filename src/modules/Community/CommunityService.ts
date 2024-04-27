import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewApplicationAnswers,
  NewFarmMemberApplication,
  NewFarmQuestion,
  UpdateFarmMemberApplication,
} from '../../types/DBTypes'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import { ListFarmerRequests } from './CommunityInteractor'
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
