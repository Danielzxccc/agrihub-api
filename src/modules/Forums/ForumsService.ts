import { NewAnswer, NewComment, NewQuestion, Answer } from '../../types/DBTypes'
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

export async function createComment(
  commentData: NewComment
): Promise<NewComment> {
  return await db
    .insertInto('forums_comments')
    .values(commentData)
    .returningAll()
    .executeTakeFirst()
}

export async function checkQuestionExists(answerId: string): Promise<Answer> {
  return await db
    .selectFrom('forums_answers')
    .selectAll()
    .where('id', '=', answerId)
    .executeTakeFirst()
}
