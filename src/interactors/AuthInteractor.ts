import { NewUser } from '../types/DBTypes'
import * as Service from '../service/UserService'
import HttpError from '../utils/HttpError'
import dbErrorHandler from '../utils/dbErrorHandler'
import bcrypt from 'bcrypt'

export async function authenticateUser(username: string, password: string) {
  try {
    const user = await Service.findUserByUsername(username)

    if (!user) {
      throw new HttpError('No user by that username', 400)
    }

    const compare = await bcrypt.compare(password, user.password)

    if (!compare) throw new HttpError('Unauthorized', 403)

    return user
  } catch (error) {
    dbErrorHandler(error)
  }
}

export async function registerUser({
  username,
  password,
  email,
  firstname,
}: NewUser) {
  try {
    const [userResult, emailResult] = await Promise.all([
      Service.findUserByUsername(username),
      Service.findUserByEmail(email),
    ])

    if (userResult) throw new HttpError('Username Already Exists', 400)
    if (emailResult) throw new HttpError('Email Already Exists', 400)

    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = {
      username,
      password: hashedPassword,
      email,
      firstname,
    }

    const createdUser = await Service.createUser(userObject)
    delete createdUser.password
    return createdUser
  } catch (error) {
    dbErrorHandler(error)
  }
}
