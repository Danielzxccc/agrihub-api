import { NewQuestion } from 'DBTypes'
import { db } from '../config/database'

export async function createQuestion(
  question: NewQuestion
): Promise<NewQuestion> {
  return await db
    .insertInto('forums')
    .values(question)
    .returningAll()
    .executeTakeFirst()
}
