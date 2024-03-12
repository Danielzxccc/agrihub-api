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
    from: 'agrihub26@gmail.com',
    to: toEmail,
    subject: 'Verify Email',
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

        <img src="https://agrihub-bucket.s3.ap-southeast-1.amazonaws.com/rrsu2rlpqtcddu9zlk9c(1).svg" width="200px"
            height="120px" style="margin: auto; margin-left: 30px; margin-bottom: -30px;" />

        <div class="alignments" style="display: flex; align-items: center; margin-top: 20px">
            <p style="font-family: 'Inter', sans-serif; font-size: 20px; margin-left: 30px;">Hi!</p>
        </div>

        <hr width="92%" style="margin-top: -30px;">
        <p
            style="font-family: 'Montserrat', sans-serif;  text-align:justify; font-size: 15px; margin-left: 30px; margin-right: 30px;">
            To complete your registration, we need to verify your email address
        </p>
        <p
            style="font-family: 'Montserrat', sans-serif;  text-align:justify; font-size: 15px; margin-left: 30px; margin-right: 30px;">
            Please proceed to the following link to verify your email:</p>
        <p
            style="font-family: 'Inter', sans-serif; text-align: center; font-size: 20px; margin-bottom: 40px; margin-top: 60px;">
            <a style="background-color: #638355; padding: 10px 130px 10px 130px; color: white; border-radius: 30px; text-decoration: none; cursor: pointer;"
                href="${process.env.API_DOMAIN}/api/account/verify-email/${token}">Verify</a>
        </p>
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
</html>
    `,
  })
}

export async function sendResetTokenEmail(toEmail: string, token: string) {
  await transporter.sendMail({
    from: 'agrihub26@gmail.com',
    to: toEmail,
    subject: 'Password Reset',
    html: `
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    height: 100vh;
                }

                h2 {
                    color: #333333;
                    text-align: left;
                }

                h4 {
                    color: #333333;
                }

                .image-container {
                    text-align: center;
                }

                .button-container {
                    text-align: center;
                    padding: 20px;

                }

                img.centered-image {
                    width: 100px;
                    /* Adjust the width as needed */
                    height: 100px;
                    /* Maintain aspect ratio */
                }

                .content {
                    margin-top: 50px;
                    max-width: 630px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    position: relative;
                    padding: 20px;
                }

                .request {
                    border-top: 2px solid #333333;
                }

                .btn {
                    padding: 15px 30px;
                    background-color: #639a47;
                    color: #ffffff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    text-decoration: none;
                    color: #ffffff;
                }

                .contact-link {

                    color: #3498db;
                    text-decoration: underline;
                }

                p {
                    text-align: left;
                    color: #7f857f;
                }
            </style>
        </head>

        <body>
            <div class="image-container">
                <img src="https://agrihub-bucket.s3.ap-southeast-1.amazonaws.com/rrsu2rlpqtcddu9zlk9c(1).svg"
                    alt="Centered Image" class="centered-image">
                <div class="content">
                    <h2>Hello User,</h2>
                    <div class="request">
                        <h4>A request has been received to change the password for your AgriHub account.</h4>
                        <div class="button-container">
                            <a type="button" class="btn" href="${process.env.CLIENT}/account/reset-password/${token}">Reset Password</a>
                        </div>
                        <p>If you did not initiate this request, please contact us immediately at <a href=""
                                class="contact-link">link.</a></p>
                        <br>
                        <p>Thank you, <br> AgriHub Team
                        </p>
                    </div>
                </div>
        </body>

        </html>
         `,
  })
}
