import * as Service from '../Users/UserService'
import { findToken, generateToken } from './AuthService'
import HttpError from '../../utils/HttpError'
import bcrypt from 'bcrypt'
import { RegisterUser, VerifyLevelTwo } from '../../schema/AuthSchema'
import { sendMail } from '../../utils/email'

export async function authenticateUser(email: string, password: string) {
  const user = await Service.findUserByEmail(email)

  if (!user) {
    throw new HttpError('No user by that email', 401)
  }

  const compare = await bcrypt.compare(password, user.password)

  if (!compare) throw new HttpError('Unauthorized', 401)
  delete user.password
  return user
}

export async function registerUser(credentials: RegisterUser) {
  const { email, password, confirmPassword } = credentials.body

  if (password !== confirmPassword) {
    throw new HttpError('Password does not match', 400)
  }

  const emailResult = await Service.findUserByEmail(email)
  if (emailResult) throw new HttpError('Email Already Exists', 400)

  const hashedPassword = await bcrypt.hash(password, 10)

  const userObject = {
    email,
    password: hashedPassword,
    verification_level: '1',
  }

  const createdUser = await Service.createUser(userObject)

  await sendEmailVerification(createdUser.id)

  return createdUser
}

export async function getCurrentUser(session: string) {
  if (!session) throw new HttpError('No Auth', 401)

  const user = await Service.findUser(session)

  if (!user) throw new HttpError('User not found', 401)

  delete user.password
  return user
}

export async function sendEmailVerification(session: string): Promise<void> {
  if (!session) throw new HttpError('No Auth', 401)
  const user = await Service.findUser(session)

  if (!user) throw new HttpError('No Auth', 401)

  const verificationToken = await generateToken(user.id)
  if (verificationToken) await sendMail(user.email, verificationToken.token)
}

export async function verifyAccountLevelOne(token: string) {
  const tokenFromDB = await findToken(token)
  const user = await Service.findUser(tokenFromDB.userid)

  if (!tokenFromDB) throw new HttpError('Token Expired', 401)
  if (!user) throw new HttpError("Can't find user", 404)

  console.log(
    new Date().toISOString(),
    new Date(tokenFromDB.expiresat).toISOString()
  )

  // update user verification level
  const updatedUser = await Service.updateUser(user.id, {
    verification_level: '2',
  })
  delete updatedUser.password
  return updatedUser
}

export async function verifyAccountLevelTwo(id: string, user: VerifyLevelTwo) {
  const authenticatedUser = await Service.findUser(id)

  if (!authenticatedUser) throw new HttpError("Can't find user", 404)

  let verification_level: number
  try {
    verification_level = parseInt(authenticatedUser.verification_level)
  } catch (error) {
    verification_level = 0
  }

  console.log(authenticatedUser.verification_level, 'level')

  if (verification_level === 3) throw new HttpError('Already Verified', 400)
  if (verification_level <= 1) {
    throw new HttpError('Verify the email first', 400)
  }

  const data = {
    ...user.body,
    verification_level: '3',
    birthdate: new Date(user.body.birthdate),
  }
  const updatedUser = await Service.updateUser(id, data)

  return updatedUser
}
