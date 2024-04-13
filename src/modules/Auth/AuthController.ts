import { Request, Response } from 'express'
import errorHandler from '../../utils/httpErrorHandler'
import * as Interactor from './AuthInteractor'
import * as Schema from '../../schema/AuthSchema'
import zParse from '../../utils/zParse'
import { SessionRequest } from '../../types/AuthType'
import { verificationSuccessPage } from '../../utils/email_template'

export async function authenticateUser(req: SessionRequest, res: Response) {
  try {
    const credentials = await zParse(Schema.UserAuthSchema, req)
    const { user, password } = credentials.body
    const auth = await Interactor.authenticateUser(user, password)
    req.session.userid = auth.id
    res.status(200).json({ message: 'User Authenticated', user: auth })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function registerUser(req: SessionRequest, res: Response) {
  try {
    const newUser = await zParse(Schema.UserRegisterSchema, req)
    const user = await Interactor.registerUser(newUser)
    req.session.userid = user.id
    res.status(201).json({ message: 'Registered Successfully', user })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function getCurrentUser(req: SessionRequest, res: Response) {
  try {
    const session = req.session.userid
    const user = await Interactor.getCurrentUser(session)
    res.status(200).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function logout(req: SessionRequest, res: Response) {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("Can't Logout: Internal Server Error")
      } else {
        // Clear the session cookie on the client side
        res.clearCookie('connect.sid')
        res.status(200).json({ message: 'Logout Successfully' })
      }
    })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function sendEmailVerification(
  req: SessionRequest,
  res: Response
) {
  try {
    const session = req.session.userid
    await Interactor.sendEmailVerification(session)
    res.status(200).json({ message: 'Sent Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const token = await zParse(Schema.verifyLevelOne, req)
    // add data const here to pass in socket.io later
    await Interactor.verifyEmail(token.params.id)

    res.status(200).send(verificationSuccessPage)
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function profileCompletion(req: SessionRequest, res: Response) {
  try {
    const id = req.session.userid
    const userInfo = await zParse(Schema.verifyLevelTwo, req)

    const updatedUser = await Interactor.profileCompletion(id, userInfo)

    res
      .status(200)
      .json({ message: 'Verified Successfully', user: updatedUser })
  } catch (error) {
    errorHandler(res, error)
  }
}
export async function setupUsernameAndTags(req: SessionRequest, res: Response) {
  try {
    const id = req.session.userid
    const { body } = await zParse(Schema.SetupUsernameTags, req)
    const file = req.file

    const user = await Interactor.setupUsernameAndTags(
      id,
      body.username,
      file,
      body.tags
    )

    res.status(200).json({ message: 'Success', user })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function sendResetToken(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.SendResetToken, req)

    await Interactor.sendResetToken(body.email)

    res.status(200).json({ message: 'Successfully Sent' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function resetPassword(req: SessionRequest, res: Response) {
  try {
    const { token } = req.params

    const { body } = await zParse(Schema.ResetPassword, req)

    await Interactor.resetPassword(token, body.password)

    res.status(200).json({ message: 'Success' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function checkResetTokenExpiration(
  req: SessionRequest,
  res: Response
) {
  try {
    const { token } = req.params

    await Interactor.checkResetTokenExpiration(token)

    res.status(200).json({ message: 'Valid Token' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function verifyOTP(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.VerifyOTP, req)

    await Interactor.verifyOTP(userid, body.code)

    res.status(200).json({ message: 'Verified Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function sendOTP(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session

    await Interactor.sendOTP(userid)

    res.status(200).json({ message: 'Sent Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function sendResetTokenViaOTP(req: SessionRequest, res: Response) {
  try {
    const { body } = await zParse(Schema.SendOTPByNumber, req)

    await Interactor.sendResetTokenViaOTP(body.contact_number)

    res.status(200).json({ message: 'Sent Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function verifyResetTokenViaOTP(
  req: SessionRequest,
  res: Response
) {
  try {
    const { body } = await zParse(Schema.VerifyOTP, req)

    const token = await Interactor.verifyResetTokenViaOTP(body.code)

    res.status(200).json({ token })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function confirmPassword(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.ConfirmPassword, req)

    await Interactor.confirmPassword(userid, body.password)

    res.status(200).json({ message: 'Successful Password Confirmation' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function updateUserEmail(req: SessionRequest, res: Response) {
  try {
    const { userid } = req.session
    const { body } = await zParse(Schema.UpdateEmail, req)

    await Interactor.updateUserEmail(userid, body.email)

    res.status(200).json({ message: 'Email Confirmation Sent Successfully' })
  } catch (error) {
    errorHandler(res, error)
  }
}

export async function confirmChangeEmailRequest(
  req: SessionRequest,
  res: Response
) {
  try {
    const { id } = req.params

    await Interactor.confirmChangeEmailRequest(id)

    res.status(200).send(verificationSuccessPage)
  } catch (error) {
    errorHandler(res, error)
  }
}
