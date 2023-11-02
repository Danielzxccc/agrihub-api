import { NewAnswer, NewQuestion } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createQuestion(
  question: NewQuestion
): Promise<NewQuestion> {
  return await db
    .insertInto('forums')
    .values(question)
    .returningAll()
    .executeTakeFirst()
}

export async function createAnswer(answerData: NewAnswer): Promise<NewAnswer> {
  return await db
    .insertInto('forums_answers')
    .values(answerData)
    .returningAll()
    .executeTakeFirst()
}
