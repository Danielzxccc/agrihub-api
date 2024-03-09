import axios from 'axios'
import HttpError from './HttpError'
import * as dotenv from 'dotenv'
dotenv.config()

export default async function sendSMS(number: string, message: string) {
  try {
    await axios.post(process.env.SMS_API_URI, {
      apikey: process.env.SMS_API_KEY,
      number,
      message,
    })
  } catch (error) {
    throw new HttpError(
      'OTP sending failed. Please contact the website administrator.',
      500
    )
  }
}
