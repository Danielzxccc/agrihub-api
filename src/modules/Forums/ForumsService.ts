import { NewAnswer, NewComment, NewQuestion, Answer } from '../../types/DBTypes'
import { db } from '../../config/database'
import { jsonObjectFrom, jsonArrayFrom } from 'kysely/helpers/postgres'
import { sql } from 'kysely'
export async function findQuestions(
  offset: number,
  searchQuery: string,
  filterKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('forums')
    .leftJoin('forums_answers', 'forums_answers.forumid', 'forums.id')
    .leftJoin('forums_ratings', 'forums_ratings.questionid', 'forums.id')
    .select(({ fn, eb }) => [
      'forums.id',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select(['avatar', 'username', 'id'])
          .whereRef('forums.userid', '=', 'users.id')
      ).as('user'),
      jsonArrayFrom(
        eb
          .selectFrom('forums_tags')
          .leftJoin('tags', 'forums_tags.tagid', 'tags.id')
          .select(['tags.tag_name as tag'])
          .whereRef('forums_tags.forumid', '=', 'forums.id')
          .groupBy(['forums_tags.id', 'forums_tags.forumid', 'tags.tag_name'])
          .orderBy('forums_tags.id')
      ).as('tags'),
      'forums.title',
      'forums.question',
      'forums.imagesrc',
      'forums.createdat',
      'forums.updatedat',
      fn.count<number>('forums_answers.id').as('answer_count'),
      fn.count<number>('forums_ratings.id').as('vote_count'),
      fn.max('forums_answers.createdat').as('latest_answer_createdat'),
      // fn.max<number>('')
    ])
    .groupBy([
      'forums.id',
      'forums.userid',
      'forums.createdat',
      // 'forums_answers.id',
      // 'forums_answers.forumid',
      // 'forums_answers.id',
    ])

  if (filterKey === 'newest') query = query.orderBy('forums.createdat', 'asc')
  if (filterKey === 'active')
    query = query.orderBy('latest_answer_createdat', 'desc')
  // if (filterKey === 'trending') query = query.orderBy('vote_count', 'desc')

  // if (searchQuery.length)
  //   query = query.where('forums.title', 'ilike', `${searchQuery}%`)

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalCount() {
  return await db
    .selectFrom('forums')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}

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
