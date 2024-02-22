import { sql } from 'kysely'
import { db } from '../../config/database'
import {
  NewBlog,
  NewBlogImage,
  NewBlogTags,
  UpdateBlog,
} from '../../types/DBTypes'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'

export async function insertNewBlog(blog: NewBlog) {
  return await db
    .insertInto('blogs')
    .values(blog)
    .returningAll()
    .executeTakeFirst()
}

export async function updateBlog(id: string, blog: UpdateBlog) {
  return await db
    .updateTable('blogs')
    .set(blog)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function findBlogById(id: string) {
  return await db
    .selectFrom('blogs')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteDraftBlog(id: string) {
  return await db
    .deleteFrom('blogs')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function insertBlogImage(image: NewBlogImage) {
  return await db
    .insertInto('blog_images')
    .values(image)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteBlogImage(id: string) {
  return await db
    .deleteFrom('blog_images')
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function findBlogImage(id: string) {
  return await db
    .selectFrom('blog_images')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function inserBlogTags(blog_tags: NewBlogTags) {
  return await db
    .insertInto('blog_tags')
    .values(blog_tags)
    .returningAll()
    .onConflict((oc) => oc.column('blog_id').column('tag_id').doNothing())
    .execute()
}

export async function findBlogTag(id: string) {
  return await db
    .selectFrom('blog_tags')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function deleteBlogTag(id: string) {
  return await db.deleteFrom('blog_tags').where('id', '=', id).execute()
}

export async function findDraftBlogs(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('blogs')
    .selectAll()
    .where('is_archived', '=', false)
    .where('status', '=', 'draft')

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('title', 'ilike', `${searchKey}%`),
        eb('author', 'ilike', `${searchKey}%`),
        eb('content', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalDraftBlogs() {
  return await db
    .selectFrom('blogs')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('is_archived', '=', false)
    .where('status', '=', 'draft')
    .executeTakeFirst()
}

export async function findBlogDetails(id: string) {
  return await db
    .selectFrom('blogs as b')
    .select(({ eb }) => [
      sql<string>`CAST(b.id AS TEXT)`.as('id'),
      'b.title',
      'b.category',
      'b.content',
      'b.author',
      'b.author_title',
      'b.status',
      'b.userid',
      'b.is_archived',
      'b.createdat',
      'b.updatedat',
      jsonArrayFrom(
        eb
          .selectFrom('blog_images as bi')
          .select(({ fn, val }) => [
            sql<string>`CAST(bi.id AS TEXT)`.as('id'),
            sql<string>`CAST(bi.id AS TEXT)`.as('id'),
            fn<string>('concat', [val(returnObjectUrl()), 'bi.image']).as(
              'image'
            ),
            'bi.thumbnail',
          ])
          .whereRef('bi.blog_id', '=', 'b.id')
      ).as('images'),
      jsonArrayFrom(
        eb
          .selectFrom('blog_tags as bt')
          .leftJoin('tags as t', 'bt.tag_id', 't.id')
          .select([
            sql<string>`CAST(bt.id AS TEXT)`.as('id'),
            't.tag_name as tag',
          ])
          .whereRef('bt.blog_id', '=', 'b.id')
          .groupBy(['bt.id', 't.tag_name'])
          .orderBy('bt.id')
      ).as('tags'),
    ])
    .where('b.id', '=', id)
    .executeTakeFirst()
}

export async function findPublishedBlog(id: string) {
  return await db
    .selectFrom('blogs as b')
    .select(({ eb }) => [
      sql<string>`CAST(b.id AS TEXT)`.as('id'),
      'b.title',
      'b.category',
      'b.content',
      'b.author',
      'b.author_title',
      'b.status',
      'b.userid',
      'b.is_archived',
      'b.createdat',
      'b.updatedat',
      jsonArrayFrom(
        eb
          .selectFrom('blog_images as bi')
          .select(({ fn, val }) => [
            sql<string>`CAST(bi.id AS TEXT)`.as('id'),
            sql<string>`CAST(bi.id AS TEXT)`.as('id'),
            fn<string>('concat', [val(returnObjectUrl()), 'bi.image']).as(
              'image'
            ),
            'bi.thumbnail',
          ])
          .whereRef('bi.blog_id', '=', 'b.id')
      ).as('images'),
      jsonArrayFrom(
        eb
          .selectFrom('blog_tags as bt')
          .leftJoin('tags as t', 'bt.tag_id', 't.id')
          .select([
            sql<string>`CAST(bt.id AS TEXT)`.as('id'),
            't.tag_name as tag',
          ])
          .whereRef('bt.blog_id', '=', 'b.id')
          .groupBy(['bt.id', 't.tag_name'])
          .orderBy('bt.id')
      ).as('tags'),
    ])
    .where('b.id', '=', id)
    .where('status', '=', 'published')
    .where('is_archived', '=', false)
    .executeTakeFirst()
}

export async function findArchivedBlogs(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db.selectFrom('blogs').selectAll().where('is_archived', '=', true)

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('title', 'ilike', `${searchKey}%`),
        eb('author', 'ilike', `${searchKey}%`),
        eb('content', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalArchivedBlogs() {
  return await db
    .selectFrom('blogs')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('is_archived', '=', true)
    .executeTakeFirst()
}

export async function findPublishedBlogs(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('blogs as b')
    .select(({ eb }) => [
      sql<string>`CAST(b.id AS TEXT)`.as('id'),
      'b.title',
      'b.category',
      'b.content',
      'b.author',
      'b.author_title',
      'b.status',
      'b.userid',
      'b.is_archived',
      'b.createdat',
      'b.updatedat',
      eb
        .selectFrom('blog_images as bi')
        .select(({ fn, val }) => [
          fn<string>('concat', [val(returnObjectUrl()), 'bi.image']).as(
            'image'
          ),
        ])
        .whereRef('bi.blog_id', '=', 'b.id')
        .where('bi.thumbnail', '=', true)
        .as('thumbnail'),
      jsonArrayFrom(
        eb
          .selectFrom('blog_tags as bt')
          .leftJoin('tags as t', 'bt.tag_id', 't.id')
          .select([
            sql<string>`CAST(bt.id AS TEXT)`.as('id'),
            't.tag_name as tag',
          ])
          .whereRef('bt.blog_id', '=', 'b.id')
          .groupBy(['bt.id', 't.tag_name'])
          .orderBy('bt.id')
      ).as('tags'),
    ])
    .where('is_archived', '=', false)
    .where('status', '=', 'published')

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('title', 'ilike', `${searchKey}%`),
        eb('author', 'ilike', `${searchKey}%`),
        eb('content', 'ilike', `${searchKey}%`),
      ])
    )
  }

  return await query.limit(perpage).offset(offset).execute()
}

export async function getTotalPublishedBlogs() {
  return await db
    .selectFrom('blogs')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('is_archived', '=', false)
    .where('status', '=', 'published')
    .executeTakeFirst()
}

export async function setBlogThumbnail(id: string, blog_id: string) {
  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('blog_images')
      .set({ thumbnail: true })
      .where('id', '=', id)
      .where('blog_id', '=', blog_id)
      .execute()

    await trx
      .updateTable('blog_images')
      .set({ thumbnail: false })
      .where('id', '!=', id)
      .where('blog_id', '=', blog_id)
      .execute()
  })
}
