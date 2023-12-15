import * as Service from '../Users/UserService'
import { deleteToken, findToken, generateToken } from './AuthService'
import HttpError from '../../utils/HttpError'
import bcrypt from 'bcrypt'
import { ProfileCompletion, RegisterUser } from '../../schema/AuthSchema'
import { sendMail } from '../../utils/email'
import { createUserTags } from '../Tags/TagsService'
import { deleteFile, readFileAsStream } from '../../utils/file'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { getVerificationLevel } from '../../utils/utils'
import { getObjectUrl, uploadFile } from '../AWS-Bucket/UploadService'
import fs from 'fs'

export async function authenticateUser(credentials: string, password: string) {
  const user = await Service.findByEmailOrUsername(credentials)

  if (!user) {
    throw new HttpError('No user by that email/user', 401)
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
  return { ...user, avatar: user.avatar ? getObjectUrl(user.avatar) : null }
}

export async function sendEmailVerification(session: string): Promise<void> {
  if (!session) throw new HttpError('No Auth', 401)
  const user = await Service.findUser(session)

  if (!user) throw new HttpError('No Auth', 401)

  const verificationToken = await generateToken(user.id)
  if (verificationToken) await sendMail(user.email, verificationToken.token)
}

export async function verifyEmail(token: string) {
  // check token expiration date
  const tokenFromDB = await findToken(token)
  if (!tokenFromDB) throw new HttpError('Token Expired', 401)

  const user = await Service.findUser(tokenFromDB.userid)
  if (!user) throw new HttpError("Can't find user", 404)

  // delete token before updating the verification level
  await deleteToken(tokenFromDB.id)

  // update user verification level
  const updatedUser = await Service.updateUser(user.id, {
    verification_level: '2',
  })
  delete updatedUser.password
  return updatedUser
}

export async function profileCompletion(id: string, user: ProfileCompletion) {
  const authenticatedUser = await Service.findUser(id)

  if (!authenticatedUser) throw new HttpError("Can't find user", 404)

  let verification_level: number
  try {
    verification_level = parseInt(authenticatedUser.verification_level)
  } catch (error) {
    verification_level = 0
  }

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

// try catch to check if we need to delete old image to update the other one
export async function setupUsernameAndTags(
  session: string,
  username: string,
  image: Express.Multer.File,
  tags: Array<string>
) {
  try {
    const user = await Service.findUser(session)
    if (!user) throw new HttpError('No Auth', 401)

    let verificationLevel = getVerificationLevel(user.verification_level)

    if (verificationLevel === 4) {
      throw new HttpError('Already Verified', 400)
    }

    if (verificationLevel !== 3) {
      throw new HttpError('Setup your profile first', 400)
    }

    const checkUsername = await Service.findUserByUsername(username)
    if (checkUsername) throw new HttpError('Username already exists', 400)

    const fileKey = !user.avatar ? image.filename : user.avatar
    console.log(fileKey, 'file to be uploaded')
    // create file stream
    const stream: fs.ReadStream = await readFileAsStream(image.path)
    await uploadFile(stream, fileKey, image.mimetype)

    const usertags = tags.map((tag) => {
      return {
        userid: session,
        tagid: String(tag),
      }
    })

    // update user's username and avatar
    const updatedUser = await Service.updateUser(session, {
      username,
      avatar: fileKey,
      verification_level: '4',
    })
    // create user tags
    await createUserTags(usertags)

    // delete the file in local storage after updating the user
    deleteFile(image.filename)

    // delete password object in response object
    delete updatedUser.password
    return { ...updatedUser, avatar: getObjectUrl(fileKey) }
  } catch (error) {
    deleteFile(image.filename)
    dbErrorHandler(error)
  }
}
