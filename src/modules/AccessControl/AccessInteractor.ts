import { NewAccessControl, NewUser } from '../../types/DBTypes'
import bcrypt from 'bcrypt'
import { createUser, findUserByEmail } from '../Users/UserService'
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
    verification_level: '4',
  }

  const newAdmin = await createUser(adminObject)

  await Service.createAccessControl({
    ...access,
    userid: newAdmin.id,
  })

  return newAdmin
}
