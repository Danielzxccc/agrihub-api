import * as Service from '../Users/UserService'
import {
  createChangeEmailRequest,
  createChangeNumberRequest,
  deleteChangeEmailRequest,
  deleteChangeNumberRequest,
  deleteOTPCode,
  deleteResetToken,
  deleteToken,
  findChangeEmailRequest,
  findChangeNumberRequest,
  findOTPCode,
  findOTPResetCode,
  findResetToken,
  findResetTokenByUserId,
  findToken,
  generateOTPcode,
  generateResetToken,
  generateToken,
} from './AuthService'
import HttpError from '../../utils/HttpError'
import bcrypt from 'bcrypt'
import { ProfileCompletion, RegisterUser } from '../../schema/AuthSchema'
import {
  sendChangeEmailRequest,
  sendMail,
  sendResetTokenEmail,
} from '../../utils/email'
import { createUserTags } from '../Tags/TagsService'
import { deleteFile, readFileAsStream } from '../../utils/file'
import dbErrorHandler from '../../utils/dbErrorHandler'
import { generateOTP, getVerificationLevel } from '../../utils/utils'
import { getObjectUrl, uploadFile } from '../AWS-Bucket/UploadService'
import fs from 'fs'
import sendSMS from '../../utils/sendSMS'

export async function authenticateUser(credentials: string, password: string) {
  const user = await Service.findByEmailOrUsername(credentials)

  if (!user) {
    throw new HttpError('Invalid username or password', 401)
  }

  if (user.isbanned) {
    throw new HttpError('Your account has been banned.', 401)
  }

  const compare = await bcrypt.compare(password, user.password)

  if (!compare) throw new HttpError('Invalid Credentials', 401)
  delete user.password
  return user
}

export async function registerUser(credentials: RegisterUser) {
  const { phone_number, email, password, confirmPassword } = credentials.body

  if (!phone_number && !email) {
    throw new HttpError(
      'Please select one registration mode: either email or phone number.',
      400
    )
  }

  if (phone_number && email) {
    throw new HttpError(
      'Please select one registration mode: either email or phone number.',
      400
    )
  }

  if (email) {
    const emailResult = await Service.findUserByEmail(email)
    if (emailResult) throw new HttpError('Email Already Exists', 409)
  }

  if (phone_number) {
    const phoneNumberResult = await Service.findUserByPhoneNumber(phone_number)
    if (phoneNumberResult)
      throw new HttpError('Phone Number Already Exists', 409)
  }

  if (password !== confirmPassword) {
    throw new HttpError('Password does not match', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const userObject = {
    email: email ? email : '',
    contact_number: phone_number,
    password: hashedPassword,
    verification_level: '1',
  }

  const createdUser = await Service.createUser(userObject)

  if (email) {
    await sendEmailVerification(createdUser.id)
  }

  if (phone_number) {
    await sendOTP(createdUser.id)
  }

  return createdUser
}

export async function getCurrentUser(session: string) {
  if (!session) throw new HttpError('No Auth', 401)

  const user = await Service.findUser(session)

  if (!user) throw new HttpError('User not found', 401)

  if (user.role === 'admin') {
    user.farms = true
    user.learning = true
    user.event = true
    user.blog = true
    user.forums = true
    user.admin = true
    user.cuai = true
    user.home = true
    user.about = true
    user.users = true
    user.privacy_policy = true
    user.terms_and_conditions = true
    user.user_feedback = true
    user.help_center = true
    user.activity_logs = true
    user.crops = true
  }

  delete user.password
  return { ...user, avatar: user.avatar ? getObjectUrl(user.avatar) : null }
}

export async function sendOTP(session: string) {
  if (!session) throw new HttpError('No Auth', 401)
  const user = await Service.findUser(session)

  if (!user) throw new HttpError('No Auth', 401)
  if (getVerificationLevel(user.verification_level) > 1) {
    throw new HttpError('Already Verified', 400)
  }
  // generate code here for production
  const OTPCode = generateOTP()

  await generateOTPcode(session, OTPCode, user.contact_number)
  // sms gateway logic here later
  await sendSMS(OTPCode, user.contact_number, `OTP CODE: {otp}`)
}

export async function sendResetOTP(session: string) {
  if (!session) throw new HttpError('No Auth', 401)
  const user = await Service.findUser(session)

  if (!user) throw new HttpError('Invalid User', 401)
  if (getVerificationLevel(user.verification_level) !== 4) {
    throw new HttpError('Invalid User', 400)
  }
  // generate code here for production
  const OTPCode = generateOTP()

  await generateOTPcode(session, OTPCode, user.contact_number)
  // sms gateway logic here later
  await sendSMS(OTPCode, user.contact_number, `OTP CODE: {otp}`)
}

export async function verifyOTP(session: string, code: number) {
  if (!session) throw new HttpError('No Auth', 401)
  const user = await Service.findUser(session)
  if (!user) throw new HttpError('No Auth', 401)

  if (getVerificationLevel(user.verification_level) > 1) {
    throw new HttpError('Already Verified', 400)
  }

  const OTPCode = await findOTPCode(session, code)
  if (!OTPCode) throw new HttpError('Invalid Code', 400)

  await deleteOTPCode(user.id, OTPCode.otp_code, user.contact_number)

  await Service.updateUser(user.id, {
    verification_level: '2',
  })
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
    if (checkUsername) throw new HttpError('Username already exists', 409)

    const fileKey = !user.avatar ? image?.filename : user.avatar
    // create file stream
    if (image?.filename) {
      const stream: fs.ReadStream = await readFileAsStream(image.path)
      await uploadFile(stream, fileKey, image.mimetype)
      deleteFile(image.filename)
    }

    // update user's username and avatar
    const updatedUser = await Service.updateUser(session, {
      username,
      avatar: fileKey,
      verification_level: '4',
    })

    if (tags?.length) {
      const usertags = tags?.map((tag) => {
        return {
          userid: session,
          tagid: String(tag),
        }
      })

      // create user tags
      await createUserTags(usertags)
    }

    // delete password object in response object
    delete updatedUser.password
    return { ...updatedUser, avatar: getObjectUrl(fileKey) }
  } catch (error) {
    if (image?.filename) {
      deleteFile(image.filename)
    }
    dbErrorHandler(error)
  }
}

export async function sendResetToken(email: string) {
  const user = await Service.findUserByEmail(email)

  if (!user) {
    throw new HttpError('No user by that email', 400)
  }

  const resetToken = await generateResetToken(user.id)

  await sendResetTokenEmail(user.email, resetToken.id)
}

export async function resetPassword(token: string, password: string) {
  const findToken = await findResetToken(token)

  if (!findToken) {
    throw new HttpError('Token Expired', 401)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await Service.updateUser(findToken.userid, { password: hashedPassword })

  await Service.clearUserSession(findToken.userid)
  await deleteResetToken(findToken.id)
}

export async function checkResetTokenExpiration(token: string) {
  const findToken = await findResetToken(token)

  if (!findToken) throw new HttpError('Token Expired', 400)
}

export async function sendResetTokenViaOTP(contact_number: string) {
  const user = await Service.findUserByNumber(contact_number)

  if (!user) {
    throw new HttpError('Invalid Contact Number', 404)
  }

  //generate new reset token
  await generateResetToken(user.id)

  //send new OTP for verification
  await sendResetOTP(user.id)
}

export async function verifyResetTokenViaOTP(code: number) {
  const OTPCode = await findOTPResetCode(code)

  if (!OTPCode) {
    throw new HttpError('Invalid Code', 404)
  }

  const findToken = await findResetTokenByUserId(OTPCode.userid)

  if (!findToken) throw new HttpError('Token Expired', 400)

  await deleteOTPCode(findToken.userid, OTPCode.otp_code, OTPCode.phone_number)

  return findToken.id
}

export async function confirmPassword(userid: string, password: string) {
  if (!userid) {
    throw new HttpError('Unauthorized', 401)
  }

  const user = await Service.findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  const compare = await bcrypt.compare(password, user.password)

  if (!compare) {
    throw new HttpError('Unauthorized', 401)
  }
}

export async function updateUserEmail(userid: string, email: string) {
  if (!userid) {
    throw new HttpError('Unauthorized', 401)
  }

  const user = await Service.findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  if (user.email === email) {
    throw new HttpError(
      'The email you entered is already your current email.',
      400
    )
  }

  const checkEmailIfExisting = await Service.findUserByEmail(email)

  if (checkEmailIfExisting) {
    throw new HttpError('Email Already Exists', 400)
  }

  const newChangeEmailRequest = await createChangeEmailRequest({
    email,
    userid,
  })

  await sendChangeEmailRequest(email, newChangeEmailRequest.id)
  // return
}

export async function confirmChangeEmailRequest(id: string) {
  const emailRequest = await findChangeEmailRequest(id)

  if (!emailRequest) {
    throw new HttpError('Token Not Found', 404)
  }

  await Service.updateUser(emailRequest.userid, { email: emailRequest.email })

  await deleteChangeEmailRequest(emailRequest.id)
}

export async function updateUserNumber(userid: string, number: string) {
  if (!userid) {
    throw new HttpError('Unauthorized', 401)
  }

  const user = await Service.findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  if (user.contact_number === number) {
    throw new HttpError(
      'The number you entered is already your current number.',
      400
    )
  }

  const checkNumberIfExisting = await Service.findUserByPhoneNumber(number)

  if (checkNumberIfExisting) {
    throw new HttpError('Number Already Exists', 400)
  }

  const OTPCode = generateOTP()

  await createChangeNumberRequest({ number, otp: OTPCode, userid })

  const data = await sendSMS(OTPCode, number, `OTP CODE: {otp}`)
  console.log(data, 'BIG DATA NUMBER')
}

export async function confirmChangeNumberRequest(otp: number) {
  const findOtp = await findChangeNumberRequest(otp)

  if (!findOtp) {
    throw new HttpError('Invalid Code', 400)
  }

  await Service.updateUser(findOtp.userid, { contact_number: findOtp.number })

  await deleteChangeNumberRequest(findOtp.id)
}

type UpdatePassword = {
  userid: string
  oldPassword: string
  newPassword: string
}

export async function updatePassword({
  userid,
  newPassword,
  oldPassword,
}: UpdatePassword) {
  if (!userid) {
    throw new HttpError('Unauthorized', 401)
  }

  const user = await Service.findUser(userid)

  if (!user) {
    throw new HttpError('Unauthorized', 401)
  }

  const compare = await bcrypt.compare(oldPassword, user.password)

  if (!compare) throw new HttpError('Invalid Credentials', 401)

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await Service.updateUser(userid, { password: hashedPassword })
}
