import axios from 'axios'
import HttpError from './HttpError'
import * as dotenv from 'dotenv'
import log from './utils'
dotenv.config()

function swapCode(
  originalString: string,
  wordToReplace: string,
  replacementWord: string
) {
  const modifiedString = originalString.replace(
    new RegExp('\\b' + wordToReplace + '\\b', 'g'),
    replacementWord
  )
  return modifiedString
}

export default async function sendSMS(
  code: number,
  number: string,
  message: string
) {
  try {
    await axios.post(process.env.SMS_API_URI, {
      apikey: process.env.SMS_API_KEY,
      number,
      message,
      code,
    })
  } catch (error) {
    log.info('ERROR SENDING MESSAGE', error)
    console.log(error, 'ERROR OBJECT SEND MESSAGE')
    throw new HttpError(
      'OTP sending failed. Please contact the website administrator.',
      500
    )
  }
}
