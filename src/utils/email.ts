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
  <html>

  <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title></title>
      <meta name="description" content="">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Montserrat&display=swap"
          rel="stylesheet">
  </head>

  <body style="align-items: center; background-color: #E8E8E8;">

      <svg></svg>

      <div style="background-color: white; width: 50%; border-radius: 10px; margin: auto;">

          <img src="https://res.cloudinary.com/dssodjqpe/image/upload/v1699793014/avg63hiii2mekqpwlvii.png" width="120px"
              height="120px" style="margin: auto; margin-left: 30px; margin-bottom: -30px;" />

          <div class="alignments" style="display: flex; align-items: center;">
              <p style="font-family: 'Inter', sans-serif; font-size: 20px; margin-left: 30px;">Hi, Dela Cruz, Juan P.</p>
              <img src="" width="70px" height="70px"
                  style="margin: auto; margin-right: 30px; margin-bottom: -20px; border-radius: 100%;" />
          </div>

          <p
              style="font-family: 'Montserrat', sans-serif; margin-left: 30px; font-size: 11px; padding-bottom: 40px; color: gray; line-height: 1px;">
              Here are your password reset instructions</p>
          <hr width="92%" style="margin-top: -30px;">
          <p
              style="font-family: 'Montserrat', sans-serif;  text-align:justify; font-size: 15px; margin-left: 30px; margin-right: 30px;">
              A request to reset your Agrihub password has been made. If you did not make this request, simply ignore this
              email. If you did make this request, please reset your password: </p>
          <p
              style="font-family: 'Inter', sans-serif; text-align: center; font-size: 20px; margin-bottom: 40px; margin-top: 60px;">
              <a style="background-color: #638355; padding: 10px 130px 10px 130px; color: white; border-radius: 30px; text-decoration: none; cursor: pointer;"
                  href="${process.env.HOST}/api/account/verify-email/${token}">Verify</a></p>
          <p
              style="font-family: 'Montserrat', sans-serif;  text-align:justify; font-size: 15px; margin-left: 30px; margin-right: 30px;">
              Thank you, <br> Team Agrihub</p>
          <p
              style="font-family: 'Montserrat', sans-serif;  text-align: justify; font-size: 11px; padding-bottom: 40px; color: gray; margin-left: 30px;">
              If the button above does not work, try copying and pasting the URL into your <br> browser. If you continue
              to have problems, please visit our <b style="color: black;">Help Center</b></p>
      </div>
      <div class="footer">

      </div>

  </body>

  </html>`,
  })
}
