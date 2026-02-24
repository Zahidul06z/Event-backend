import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.admin_mail,        // your email
    pass: 'stte ssnz nptg euwj'            // app password (not your Gmail password)
  }
});


export default transporter