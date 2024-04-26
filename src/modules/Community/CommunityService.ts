import { db } from '../../config/database'
import { NewFarmQuestion } from '../../types/DBTypes'

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
