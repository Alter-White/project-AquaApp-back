import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import {env} from './env.js'
import createHttpError from "http-errors";

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env(SMTP.SMTP_HOST),
      port: Number(env(SMTP.SMTP_PORT)),
      secure: false,
      auth: {
        user: env(SMTP.SMTP_USER),
        pass: env(SMTP.SMTP_PASSWORD),
      }
    })
  }

  async sendEmail(to, link){
    try{
      await this.transporter.sendMail({
        from: env(SMTP.SMTP_FROM),
        to: to,
        subject: 'Reset password',
        text: "",
        html:
          `<div>
                <h1>To reset your password, follow the link</h1>
                <a href="${process.env.APP_DOMAIN}/${link}"><button>RESET PASSWORD</button></a>
            </div>`
      })
    }catch (e){
      throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
  }
}

export default new MailService();
