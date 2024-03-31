import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import { sql } from 'kysely'
import { ClientDetails } from '../../schema/CmsSchema'
import {
  NewAboutUsCarousel,
  NewClientMembers,
  NewClientPartners,
  NewClientSocials,
  NewUserFeedback,
  UpdateAboutUs,
} from '../../types/DBTypes'

export async function findClientDetails() {
  return await db
    .selectFrom('client_details as cd')
    .select(({ eb, val, fn }) => [
      'cd.id',
      'cd.name',
      'cd.logo',
      'cd.email',
      'cd.contact_number',
      'cd.address',
      'cd.mission',
      'cd.vision',
      'cd.createdat',
      'cd.updatedat',
      jsonArrayFrom(
        eb
          .selectFrom('client_socials as cs')
          .select([
            sql<string>`CAST(cs.id AS TEXT)`.as('id'),
            'cs.name',
            'cs.link',
            'cs.createdat',
            'cs.updatedat',
          ])
      ).as('socials'),
      jsonArrayFrom(
        eb
          .selectFrom('client_partners as cp')
          .select(({ fn, val }) => [
            sql<string>`CAST(cp.id AS TEXT)`.as('id'),
            'cp.logo',
            'cp.name',
            'cp.description',
            'cp.createdat',
            'cp.updatedat',
          ])
      ).as('partners'),
      jsonArrayFrom(
        eb
          .selectFrom('client_members as cm')
          .select(({ fn, val }) => [
            sql<string>`CAST(cm.id AS TEXT)`.as('id'),
            'cm.name',
            'cm.image',
            'cm.position',
            'cm.description',
          ])
      ).as('members'),
    ])
    .executeTakeFirst()
}

export async function updateClientDetails(data: ClientDetails) {
  const details = data.body
  const {
    name,
    logo,
    email,
    contact_number,
    address,
    mission,
    vision,
    socials,
    partners,
    members,
  } = details

  const clientDetails = {
    name,
    logo,
    email,
    contact_number,
    address,
    mission,
    vision,
  }

  return await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('client_details')
      .set(clientDetails)
      .returningAll()
      .execute()

    if (socials?.length) {
      await trx
        .insertInto('client_socials')
        .values(socials as NewClientSocials)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet((eb) => ({
            link: eb.ref('excluded.link'),
            name: eb.ref('excluded.name'),
            updatedat: new Date(),
          }))
        )
        .execute()
    }

    if (partners?.length) {
      await trx
        .insertInto('client_partners')
        .values(partners as NewClientPartners)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet((eb) => ({
            logo: eb.ref('excluded.logo'),
            description: eb.ref('excluded.description'),
            name: eb.ref('excluded.name'),
            updatedat: new Date(),
          }))
        )
        .execute()
    }

    if (members?.length) {
      await trx
        .insertInto('client_members')
        .values(members as NewClientMembers)
        .onConflict((oc) =>
          oc.column('id').doUpdateSet((eb) => ({
            name: eb.ref('excluded.name'),
            image: eb.ref('excluded.image'),
            position: eb.ref('excluded.position'),
            description: eb.ref('excluded.description'),
          }))
        )
        .execute()
    }
  })
}

export async function deleteClientSocial(id: string) {
  return await db
    .deleteFrom('client_socials')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteClientPartner(id: string) {
  return await db
    .deleteFrom('client_partners')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteClientMember(id: string) {
  return await db
    .deleteFrom('client_members')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export async function createUserFeedback(feedback: NewUserFeedback) {
  return await db
    .insertInto('user_feedbacks')
    .values(feedback)
    .returningAll()
    .executeTakeFirst()
}

export async function findUserFeedbacks(
  offset: number,
  searchKey: string,
  perpage: number
) {
  let query = db
    .selectFrom('user_feedbacks as uf')
    .leftJoin('users as u', 'u.id', 'uf.userid')
    .select([
      'uf.id',
      'uf.userid',
      'uf.feedback',
      'uf.rating',
      'uf.createdat',
      'uf.updatedat',
      'uf.is_read',
      'u.firstname',
      'u.avatar',
      'u.lastname',
    ])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('feedback', 'ilike', `${searchKey}%`),
        eb('rating', '=', `${searchKey}`),
      ])
    )
  }

  return await query
    .orderBy('createdat desc')
    .limit(perpage)
    .offset(offset)
    .execute()
}

export async function getTotalUserFeedbacks(searchKey: string) {
  let query = db
    .selectFrom('user_feedbacks')
    .select(({ fn }) => [fn.count<number>('id').as('count')])

  if (searchKey.length) {
    query = query.where((eb) =>
      eb.or([
        eb('feedback', 'ilike', `${searchKey}%`),
        eb('rating', '=', `${searchKey}`),
      ])
    )
  }

  return await query.executeTakeFirst()
}

export async function viewUserFeedback(id: string) {
  return await db.transaction().execute(async (trx) => {
    const userFeedback = await trx
      .selectFrom('user_feedbacks as uf')
      .leftJoin('users as u', 'u.id', 'uf.userid')
      .select([
        'uf.id',
        'uf.userid',
        'uf.feedback',
        'uf.rating',
        'uf.createdat',
        'uf.updatedat',
        'uf.is_read',
        'u.firstname',
        'u.avatar',
        'u.lastname',
      ])
      .where('uf.id', '=', id)
      .executeTakeFirst()

    await trx
      .updateTable('user_feedbacks')
      .set({ is_read: true })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst()

    return userFeedback
  })
}

export async function getVisionStatistics() {
  return await db
    .selectNoFrom((eb) => [
      eb
        .selectFrom('community_farms')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('community_farms'),

      eb
        .selectFrom('users')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where((eb) =>
          eb.or([eb('role', '=', 'farmer'), eb('role', '=', 'farm_head')])
        )
        .as('registered_farmer'),

      eb
        .selectFrom('forums_answers')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .as('forums_answers'),

      eb
        .selectFrom('reported_problems')
        .select(({ fn }) => [fn.count<number>('id').as('count')])
        .where('status', '=', 'pending')
        .as('pending_farm_problems'),

      eb
        .selectFrom('learning_materials')
        .select(({ fn }) => [fn.count<string>('id').as('count')])
        .where('status', '=', 'published')
        .as('learning_materials'),

      eb
        .selectFrom('events')
        .select(({ fn }) => [fn.count<string>('id').as('count')])
        .as('events'),

      eb
        .selectFrom('blogs')
        .select(({ fn }) => [fn.count<string>('id').as('count')])
        .where('status', '=', 'published')
        .as('blogs'),
    ])
    .executeTakeFirst()
}

export async function updateAboutUs(about: UpdateAboutUs) {
  return await db
    .updateTable('about_us')
    .set(about)
    .returningAll()
    .executeTakeFirst()
}

export async function viewAboutUs() {
  return await db
    .selectFrom('about_us as ab')
    .select((eb) => [
      'ab.about_us',
      'ab.agrihub_user_logo',
      'ab.banner',
      'ab.city_commitment',
      'ab.city_image',
      'ab.city_image',
      'ab.createdat',
      'ab.id',
      'ab.president_image',
      'ab.president_message',
      'ab.qcu_logo',
      'ab.updatedat',
      jsonArrayFrom(
        eb
          .selectFrom('about_us_carousel as auc')
          .select([
            'auc.image',
            'auc.createdat',
            'auc.updatedat',
            sql<string>`CAST(auc.id AS TEXT)`.as('id'),
          ])
      ).as('images'),
    ])
    .executeTakeFirst()
}

export async function createAboutCarouselImage(image: NewAboutUsCarousel) {
  return await db
    .insertInto('about_us_carousel')
    .values(image)
    .returningAll()
    .executeTakeFirst()
}

export async function deleteAboutCarouselImage(id: string) {
  return await db
    .deleteFrom('about_us_carousel')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}
