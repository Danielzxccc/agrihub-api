import { NewAnswer, NewComment, NewQuestion, Answer } from '../../types/DBTypes'
import { db } from '../../config/database'

export async function createQuestion(
  question: NewQuestion,
  tagsId: string[]
): Promise<NewQuestion> {
  const forumContent = await db.transaction().execute(async (trx) => {
    const forum = await trx
      .insertInto('forums')
      .values(question)
      .returningAll()
      .executeTakeFirstOrThrow()

    if (Array.isArray(tagsId) && tagsId.length > 0) {
      const tagRecords = tagsId.map((tagName) => ({
        forumid: forum.id,
        tagid: tagName,
      }))

      await trx
        .insertInto('forums_tags')
        .values(tagRecords)
        .returningAll()
        .executeTakeFirst()
    }

    return forum
  })

  return forumContent
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
