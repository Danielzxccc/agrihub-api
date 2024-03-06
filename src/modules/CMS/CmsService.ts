import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { db } from '../../config/database'
import { returnObjectUrl } from '../AWS-Bucket/UploadService'
import { sql } from 'kysely'

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
