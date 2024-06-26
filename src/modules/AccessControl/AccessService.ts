import { db } from '../../config/database'
import { NewAccessControl, UpdateAccessControl } from '../../types/DBTypes'

export async function createAccessControl(access: NewAccessControl) {
  return await db
    .insertInto('admin_access')
    .values(access)
    .returningAll()
    .executeTakeFirst()
}

export async function updateAccessControl(
  id: string,
  access: UpdateAccessControl
) {
  return await db
    .updateTable('admin_access')
    .set(access)
    .returningAll()
    .where('id', '=', id)
    .executeTakeFirst()
}

export async function updateAdminAcessByUserId(
  id: string,
  access: UpdateAccessControl
) {
  return await db
    .updateTable('admin_access')
    .set(access)
    .returningAll()
    .where('userid', '=', id)
    .executeTakeFirst()
}

export async function findUserAccess(userid: string) {
  return await db
    .selectFrom('admin_access')
    .selectAll()
    .where('userid', '=', userid)
    .executeTakeFirst()
}
