import * as dotenv from 'dotenv';
import * as nodemailer from 'nodemailer';

import {
  EMAIL_FROM_ADDRESS,
  EMAIL_FROM_NAME,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USERNAME,
} from '@/config/environment.config';

dotenv.config();

export const EmailTransport = nodemailer.createTransport(
  {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  },
  {
    from: {
      name: EMAIL_FROM_NAME,
      address: EMAIL_FROM_ADDRESS,
    },
  }
);
