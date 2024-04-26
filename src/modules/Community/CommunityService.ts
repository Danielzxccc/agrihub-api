import { db } from '../../config/database'
import {
  NewApplicationAnswers,
  NewFarmMemberApplication,
  NewFarmQuestion,
} from '../../types/DBTypes'

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
