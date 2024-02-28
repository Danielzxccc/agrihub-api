import { NewAccessControl, NewUser } from '../../types/DBTypes'
import bcrypt from 'bcrypt'
import { createUser, findAdmin, findUserByEmail } from '../Users/UserService'
import * as Service from './AccessService'
import HttpError from '../../utils/HttpError'

export async function createNewAdmin(user: NewUser, access: NewAccessControl) {
  const hashedPassword = await bcrypt.hash(user.password, 10)

  const email = await findUserByEmail(user.email)
  if (email) throw new HttpError('Email already in use', 400)

  const adminObject: NewUser = {
    ...user,
    password: hashedPassword,
    role: 'asst_admin',
    verification_level: '2',
  }

  const newAdmin = await createUser(adminObject)

  await Service.createAccessControl({
    ...access,
    userid: newAdmin.id,
  })

  return newAdmin
}

export async function updateAdminAccess(id: string, access: NewAccessControl) {
  const adminAccess = await Service.findUserAccess(id)

  if (!adminAccess) {
    throw new HttpError('Access Control List Not Found', 404)
  }

  await Service.updateAdminAcessByUserId(id, access)
}

export async function viewAdminAccess(id: string) {
  const admin = await findAdmin(id)

  if (!admin) {
    throw new HttpError('Admin Not Found', 404)
  }

  return admin
}
