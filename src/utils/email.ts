import { createTransport } from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

const transporter = createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendMail(toEmail: string, token: string) {
  await transporter.sendMail({
    from: 'danie.araojo022@gmail.com',
    to: toEmail,
    subject: 'Your invoice',
    html: `
    <a href="${process.env.HOST}/api/account/verify-email/${token}" target="_blank">Verify Here</a>`,
  })
}
