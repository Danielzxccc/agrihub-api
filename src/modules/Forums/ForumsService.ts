import {
  NewAnswer,
  NewComment,
  NewQuestion,
  Answer,
  UpdateQuestion,
  NewVoteQuestion,
  UpdateAnswer,
  UpdateComment,
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
  userid: string,
  profile?: string,
  tag?: string
) {
  let query = db
    .selectFrom('forums')
    .leftJoin('forums_answers', 'forums_answers.forumid', 'forums.id')
    .leftJoin('forums_ratings', 'forums_ratings.questionid', 'forums.id')
    .leftJoin('users as u', 'forums.userid', 'u.id')
    .select(({ fn, eb }) => [
      'forums.id',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select([
            'avatar',
            'username',
            'role',
            sql<string>`CAST(id AS TEXT)`.as('id'),
          ])
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
      sql<string>`COUNT(DISTINCT forums_answers.id)`.as('answer_count'),
      fn
        .count<number>('forums_ratings.id')
        .filterWhere('type', '=', 'upvote')
        .distinct()
        .as('vote_count'),
      // fn.count<number>('DISTINCT forums_answers.id').as('answer_count'),
      // fn.count<number>('forums_ratings.id').as('vote_count'),
      fn.max('forums_answers.createdat').as('latest_answer_createdat'),
      jsonObjectFrom(
        eb
          .selectFrom('forums_ratings')
          .select([sql<string>`CAST(id AS TEXT)`.as('id'), 'type'])
          .where('forums_ratings.userid', '=', userid)
          .whereRef('forums.id', '=', 'forums_ratings.questionid')
      ).as('vote'),
      // fn.max<number>('')
    ])
    .groupBy(['forums.id', 'forums.userid', 'forums.createdat'])

  if (profile.length) query = query.where('forums.userid', '=', profile)
  if (filterKey === 'newest') query = query.orderBy('forums.createdat', 'desc')
  if (filterKey === 'active')
    query = query.orderBy('latest_answer_createdat', 'desc')
  if (filterKey === 'trending') query = query.orderBy('vote_count', 'desc')

  if (searchQuery.length) {
    query = query.where('forums.title', 'ilike', `%${searchQuery}%`)
    query = query.where('forums.question', 'ilike', `%${searchQuery}%`)
  }

  if (tag.length) {
    query = query.where(({ selectFrom, exists }) =>
      exists(
        selectFrom('forums_tags')
          .leftJoin('tags as t', 't.id', 'forums_tags.tagid')
          .select('forums_tags.id')
          .where('t.tag_name', '=', tag)
          .whereRef('forums_tags.forumid', '=', 'forums.id')
      )
    )
  }

  query = query.where('u.isbanned', '=', false)

  return await query.limit(perpage).offset(offset).execute()
}

export async function findSavedQuestions(
  offset: number,
  searchQuery: string,
  filterKey: string,
  perpage: number,
  userid: string
) {
  let query = db
    .selectFrom('saved_questions')
    .leftJoin('forums', 'saved_questions.forumid', 'forums.id')
    .leftJoin('forums_answers', 'forums_answers.forumid', 'forums.id')
    .leftJoin('forums_ratings', 'forums_ratings.questionid', 'forums.id')
    .leftJoin('users as u', 'forums.userid', 'u.id')
    .select(({ fn, eb }) => [
      'forums.id',
      'saved_questions.id as saved_id',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select([
            'avatar',
            'username',
            sql<string>`CAST(id AS TEXT)`.as('id'),
          ])
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
      sql<string>`COUNT(DISTINCT forums_answers.id)`.as('answer_count'),
      fn
        .count<number>('forums_ratings.id')
        .filterWhere('type', '=', 'upvote')
        .distinct()
        .as('vote_count'),
      // fn.count<number>('DISTINCT forums_answers.id').as('answer_count'),
      // fn.count<number>('forums_ratings.id').as('vote_count'),
      fn.max('forums_answers.createdat').as('latest_answer_createdat'),
      jsonObjectFrom(
        eb
          .selectFrom('forums_ratings')
          .select([sql<string>`CAST(id AS TEXT)`.as('id'), 'type'])
          .where('forums_ratings.userid', '=', userid)
          .whereRef('forums.id', '=', 'forums_ratings.questionid')
      ).as('vote'),
      // fn.max<number>('')
    ])
    .groupBy([
      'forums.id',
      'saved_questions.id',
      'forums.userid',
      'forums.createdat',
    ])

  if (filterKey === 'newest') query = query.orderBy('forums.createdat', 'desc')
  if (filterKey === 'active')
    query = query.orderBy('latest_answer_createdat', 'desc')
  if (filterKey === 'trending') query = query.orderBy('vote_count', 'desc')

  if (searchQuery.length)
    query = query.where('forums.title', 'ilike', `${searchQuery}%`)

  query = query.where('u.isbanned', '=', false)
  return await query
    .where('saved_questions.userid', '=', userid)
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalSavedQuestion(userid: string) {
  return await db
    .selectFrom('saved_questions')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('saved_questions.userid', '=', userid)
    .executeTakeFirst()
}

export async function viewQuestion(
  id: string,
  offset: number,
  perPage: number,
  userid: string,
  filter?: 'newest' | 'top'
) {
  const isTop = filter === 'top'
  const isNewest = filter === 'newest'

  return await db
    .selectFrom('forums')
    .leftJoin('forums_answers', 'forums_answers.forumid', 'forums.id')
    .leftJoin('forums_ratings', 'forums_ratings.questionid', 'forums.id')
    .select(({ fn, eb }) => [
      'forums.id',
      jsonObjectFrom(
        eb
          .selectFrom('users')
          .select([
            'avatar',
            'username',
            'role',
            sql<string>`CAST(id AS TEXT)`.as('id'),
          ])
          .whereRef('forums.userid', '=', 'users.id')
      ).as('user'),
      jsonArrayFrom(
        eb
          .selectFrom('forums_tags')
          .leftJoin('tags', 'forums_tags.tagid', 'tags.id')
          .select([
            'tags.tag_name as tag',
            sql<string>`CAST(tags.id AS TEXT)`.as('id'),
          ])
          .whereRef('forums_tags.forumid', '=', 'forums.id')
          .groupBy([
            'forums_tags.id',
            'tags.id',
            'forums_tags.forumid',
            'tags.tag_name',
          ])
          .orderBy('forums_tags.id')
      ).as('tags'),
      jsonArrayFrom(
        eb
          .selectFrom('forums_answers')
          .leftJoin(
            'answer_votes',
            'answer_votes.answerid',
            'forums_answers.id'
          )
          .select(({ fn }) => [
            sql<string>`CAST(forums_answers.id AS TEXT)`.as('id'),
            'forums_answers.answer',
            'forums_answers.isaccepted',
            'forums_answers.createdat',
            jsonObjectFrom(
              eb
                .selectFrom('users')
                .select([
                  'avatar',
                  'username',
                  'role',
                  sql<string>`CAST(id AS TEXT)`.as('id'),
                ])
                .whereRef('forums_answers.userid', '=', 'users.id')
            ).as('user'),
            jsonObjectFrom(
              eb
                .selectFrom('answer_votes')
                .select([sql<string>`CAST(id AS TEXT)`.as('id'), 'type'])
                .where('answer_votes.userid', '=', userid)
                .whereRef('answer_votes.answerid', '=', 'forums_answers.id')
            ).as('vote'),
            fn
              .count<number>('answer_votes.id')
              .distinct()
              .filterWhere('type', '=', 'upvote')
              .as('upvote_count'),
            fn.count<number>('answer_votes.id').as('total_vote_count'),
            jsonArrayFrom(
              eb
                .selectFrom('forums_comments')
                .select([
                  jsonObjectFrom(
                    eb
                      .selectFrom('users')
                      .select([
                        'avatar',
                        'username',
                        'role',
                        sql<string>`CAST(id AS TEXT)`.as('id'),
                      ])
                      .whereRef('userid', '=', 'users.id')
                  ).as('user'),
                  sql<string>`CAST(forums_comments.id AS TEXT)`.as('id'),
                  'forums_comments.comment',
                  'forums_comments.createdat',
                ])
                .whereRef('forums_answers.id', '=', 'forums_comments.answerid')
            ).as('comments'),
          ])
          .groupBy(['forums_answers.id', 'forums_answers.userid'])
          .whereRef('forums.id', '=', 'forums_answers.forumid')
          .$if(isTop, (qb) => qb.orderBy('upvote_count', 'desc'))
          .$if(isNewest, (qb) => qb.orderBy('forums_answers.createdat', 'desc'))
          .orderBy('forums_answers.createdat', 'desc')
          .limit(perPage)
          .offset(offset)
      ).as('answers'),
      'forums.title',
      'forums.question',
      'forums.imagesrc',
      sql<string>`CAST(forums.createdat AS TEXT)`.as('createdat'),
      sql<string>`CAST(forums.updatedat AS TEXT)`.as('updatedat'),
      'forums.views',
      sql<string>`COUNT(DISTINCT forums_answers.id)`.as('answer_count'),
      // sql<string>`COUNT(DISTINCT forums_ratings.id)`.as('vote_count'),
      fn
        .count<number>('forums_ratings.id')
        .distinct()
        .filterWhere('type', '=', 'upvote')
        .as('vote_count'),

      // fn.max('forums_answers.createdat').as('latest_answer_createdat'),
      jsonObjectFrom(
        eb
          .selectFrom('forums_ratings')
          .select([sql<string>`CAST(id AS TEXT)`.as('id'), 'type'])
          .where('forums_ratings.userid', '=', userid)
          .whereRef('forums.id', '=', 'forums_ratings.questionid')
      ).as('vote'),
      // fn.max<number>('')
    ])
    .groupBy(['forums.id', 'forums.userid', 'forums.createdat'])
    .where('forums.id', '=', id)
    .executeTakeFirst()
}

export async function getTotalAnswers(id: string) {
  return await db
    .selectFrom('forums_answers')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('forums_answers.forumid', '=', id)
    .executeTakeFirst()
}

export async function getTotalCount(id: string) {
  let query = db
    .selectFrom('forums')
    .leftJoin('users as u', 'forums.userid', 'u.id')
    .select(({ fn }) => [fn.count<number>('forums.id').as('count')])

  if (id) query = query.where('forums.userid', '=', id)

  query = query.where('u.isbanned', '=', false)
  return await query.executeTakeFirst()
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

    let tagRecords
    if (Array.isArray(tagsId) && tagsId.length > 0) {
      tagRecords = tagsId.map((tagName) => ({
        forumid: forum.id,
        tagid: tagName,
      }))
    } else if (typeof tagsId === 'string') {
      tagRecords = {
        forumid: forum.id,
        tagid: tagsId,
      }
    }

    if (tagRecords?.length || tagRecords) {
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

export async function updateQuestion(
  id: string,
  question: UpdateQuestion,
  tagsId: string[] | string,
  deletedTags: string[]
): Promise<NewQuestion> {
  const forumContent = await db.transaction().execute(async (trx) => {
    const forum = await trx
      .updateTable('forums')
      .set({ ...question, updatedat: sql`CURRENT_TIMESTAMP` })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()

    let tagRecords
    if (Array.isArray(tagsId) && tagsId.length > 0) {
      tagRecords = tagsId.map((tagName) => ({
        forumid: forum.id,
        tagid: tagName,
      }))
    } else if (typeof tagsId === 'string') {
      tagRecords = {
        forumid: forum.id,
        tagid: tagsId,
      }
    }

    if (deletedTags.length) {
      await db
        .deleteFrom('forums_tags')
        .where('forumid', '=', id)
        .where('tagid', 'in', deletedTags)
        .execute()
    }

    if (tagRecords?.length || tagRecords) {
      await trx
        .insertInto('forums_tags')
        .values(tagRecords)
        .onConflict((oc) => oc.column('tagid').column('forumid').doNothing())
        .returningAll()
        .executeTakeFirst()
    }

    return forum
  })

  return forumContent
}

export async function findQuestionTags(id: string) {
  return await db
    .selectFrom('forums_tags')
    .select('tagid')
    .where('forumid', '=', id)
    .execute()
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
          updatedat: sql`CURRENT_TIMESTAMP`,
        })
    )
    .returningAll()
    .executeTakeFirst()
}

export async function deleteQuestionVote(id: string) {
  return await db.deleteFrom('forums_ratings').where('id', '=', id).execute()
}

export async function findQuestionVote(id: string) {
  return await db
    .selectFrom('forums_ratings')
    .selectAll()
    .where('id', '=', id)
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

export async function voteAnswer(vote: NewVoteQuestion) {
  return await db
    .insertInto('answer_votes')
    .values(vote)
    .onConflict((oc) =>
      oc
        .column('answerid')
        .column('userid')
        .doUpdateSet({
          type: vote.type,
          updatedat: sql`CURRENT_TIMESTAMP`,
        })
    )
    .returningAll()
    .executeTakeFirst()
}

export async function deleteAnswerVote(id: string) {
  return await db.deleteFrom('answer_votes').where('id', '=', id).execute()
}

export async function findAnswerVote(id: string) {
  return await db
    .selectFrom('answer_votes')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function saveQuestion(userid: string, forumid: string) {
  return await db
    .insertInto('saved_questions')
    .values({ userid, forumid })
    .onConflict((oc) => oc.column('userid').column('forumid').doNothing())
    .returningAll()
    .executeTakeFirst()
}

export async function findSavedQuestion(id: string) {
  return await db
    .selectFrom('saved_questions')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function unsaveQuestion(id: string) {
  return await db.deleteFrom('saved_questions').where('id', '=', id).execute()
}

export async function deleteQuestion(id: string) {
  return await db.deleteFrom('forums').where('id', '=', id).execute()
}

export async function reportQuestion(
  userid: string,
  forumid: string,
  reason: string
) {
  return await db
    .insertInto('reported_questions')
    .values({ userid, forumid, reason })
    .onConflict((oc) => oc.column('userid').column('forumid').doNothing())
    .returningAll()
    .executeTakeFirst()
}

export async function findAnswer(id: string) {
  return await db
    .selectFrom('forums_answers')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteAnswer(id: string) {
  return await db.deleteFrom('forums_answers').where('id', '=', id).execute()
}

export async function findComment(id: string) {
  return await db
    .selectFrom('forums_comments')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteComment(id: string) {
  return await db.deleteFrom('forums_comments').where('id', '=', id).execute()
}

export async function findReportedQuestions(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('reported_questions as rq')
    .leftJoin('users as u', 'u.id', 'rq.userid')
    .leftJoin('forums as f', 'f.id', 'rq.forumid')
    .leftJoin('users as ru', 'f.userid', 'ru.id')
    .select([
      'rq.id',
      'rq.userid',
      'rq.forumid',
      'rq.reason',
      'rq.createdat',
      'rq.updatedat',
      'f.question',
      'u.firstname',
      'u.lastname',
      'u.id as userid',
      'ru.username as reported_username',
      'ru.firstname as reported_firstname',
      'ru.id as reported_userid',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('rq.reason', 'ilike', `${searchKey}%`),
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalReportedQuestions(searchKey: string) {
  let query = db
    .selectFrom('reported_questions as rq')
    .leftJoin('users as u', 'u.id', 'rq.userid')
    .leftJoin('forums as f', 'f.id', 'rq.forumid')
    .select(({ fn }) => [fn.count<number>('rq.id').as('count')])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('rq.reason', 'ilike', `${searchKey}%`),
        eb('u.firstname', 'ilike', `${searchKey}%`),
        eb('u.lastname', 'ilike', `${searchKey}%`),
      ])
    )
  }
  return await query.executeTakeFirst()
}

export async function updateAnswer(id: string, answer: UpdateAnswer) {
  return await db
    .updateTable('forums_answers')
    .set({ ...answer, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function updateComment(id: string, comment: UpdateComment) {
  return await db
    .updateTable('forums_comments')
    .set({ ...comment, updatedat: sql`CURRENT_TIMESTAMP` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

// export async function report

// export async function findVoteByUserId(userid: string) {
//   return await db
//     .selectFrom('forums_ratings')
//     .selectAll()
//     .where('userid', '=', userid)
//     .executeTakeFirst()
// }
