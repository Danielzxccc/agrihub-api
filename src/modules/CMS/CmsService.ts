import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import { sql } from 'kysely'
import { ClientDetails } from '../../schema/CmsSchema'
import {
  NewClientMembers,
  NewClientPartners,
  NewClientSocials,
} from '../../types/DBTypes'

export async function findClientDetails() {
  return await db
    .selectFrom('client_details as cd')
    .select(({ eb, val, fn }) => [
      'cd.id',
      'cd.name',
      fn<string>('concat', [val(returnObjectUrl()), 'cd.logo']).as('logo'),
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
            fn<string>('concat', [val(returnObjectUrl()), 'cp.logo']).as(
              'logo'
            ),
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
            fn<string>('concat', [val(returnObjectUrl()), 'cm.image']).as(
              'image'
            ),
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

    if (socials.length) {
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

    if (partners.length) {
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

    if (members.length) {
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
