import {
  NewAnswer,
  NewComment,
  NewQuestion,
  Answer,
  UpdateQuestion,
} from '../../types/DBTypes'
import { db } from '../../config/database'
import { jsonObjectFrom, jsonArrayFrom } from 'kysely/helpers/postgres'
import { sql } from 'kysely'

export async function findQuestionById(questionid: string) {
  return await db
    .selectFrom('forums')
    .selectAll()
    .where('id', '=', questionid)
    .executeTakeFirst()
}

export async function findQuestions(
  offset: number,
  searchQuery: string,
  filterKey: string,
  perpage: number,
  userid: string
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
      'forums.views',
      fn.count<number>('forums_answers.id').as('answer_count'),
      fn.count<number>('forums_ratings.id').as('vote_count'),
      fn.max('forums_answers.createdat').as('latest_answer_createdat'),
      jsonObjectFrom(
        eb
          .selectFrom('forums_ratings')
          .select(['type'])
          .where('forums_ratings.userid', '=', userid)
          .whereRef('forums.id', '=', 'forums_ratings.questionid')
      ).as('vote'),
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

  if (filterKey === 'newest') query = query.orderBy('forums.createdat', 'desc')
  if (filterKey === 'active')
    query = query.orderBy('latest_answer_createdat', 'desc')
  if (filterKey === 'trending') query = query.orderBy('vote_count', 'desc')

  if (searchQuery.length)
    query = query.where('forums.title', 'ilike', `${searchQuery}%`)

  return await query.limit(perpage).offset(offset).execute()
}

export async function viewQuestion(
  id: string,
  offset: number,
  perPage: number
) {
  return await db
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
      jsonArrayFrom(
        eb
          .selectFrom('forums_answers')
          .select([
            jsonObjectFrom(
              eb
                .selectFrom('users')
                .select(['avatar', 'username', 'id'])
                .whereRef('forums_answers.userid', '=', 'users.id')
            ).as('user'),
            'forums_answers.id',
            'forums_answers.answer',
            'forums_answers.isaccepted',
          ])
          .whereRef('forums.id', '=', 'forums_answers.forumid')
          .orderBy('forums_answers.createdat', 'desc')
          .limit(perPage)
          .offset(offset)
      ).as('answers'),
      'forums.title',
      'forums.question',
      'forums.imagesrc',
      'forums.createdat',
      'forums.updatedat',
      'forums.views',
      fn.count<number>('forums_answers.id').as('answer_count'),
      fn.count<number>('forums_ratings.id').as('vote_count'),
      fn.max('forums_answers.createdat').as('latest_answer_createdat'),
      // fn.max<number>('')
    ])
    .groupBy(['forums.id', 'forums.userid', 'forums.createdat'])
    .where('forums.id', '=', id)
    .executeTakeFirst()
}

export async function getTotalCount() {
  return await db
    .selectFrom('forums')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst()
}

export async function createQuestion(
  question: NewQuestion,
  tagsId: string[] | string
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

export async function voteQuestion(
  questionid: string,
  userid: string,
  vote: string
) {
  return await db
    .insertInto('forums_ratings')
    .values({
      questionid,
      userid,
      type: vote,
    })
    .onConflict((oc) =>
      oc
        .column('questionid')
        .column('userid')
        .doUpdateSet({
          type: vote,
          createdat: sql`CURRENT_TIMESTAMP`,
        })
    )
    .returningAll()
    .executeTakeFirst()
}

export async function incrementViews(id: string) {
  return await db
    .updateTable('forums')
    .set((eb) => ({
      views: eb('views', '+', '1'),
    }))
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

// export async function findVoteByUserId(userid: string) {
//   return await db
//     .selectFrom('forums_ratings')
//     .selectAll()
//     .where('userid', '=', userid)
//     .executeTakeFirst()
// }
