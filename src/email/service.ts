import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
const dotenv = require('dotenv');
dotenv.config();


@Injectable() 
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Using Gmail's SMTP service
      host: 'smtp.gmail.com',  // Gmail SMTP server
      port: 587,  // Port for TLS
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const response =  this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject,
      text: body,
    });
    return response;
  }
}
