import axios from 'axios';
import { SendMailOptions } from 'nodemailer';

import {
  EMAIL_API_KEY,
  EMAIL_DISABLE,
  EMAIL_FROM_NAME,
  EMAIL_HOST,
  EMAIL_QUEUE,
  EMAIL_REPLY_TO,
} from '@/config/environment.config';

const mailingAxios = axios.create({
  baseURL: EMAIL_HOST,
  headers: {
    Authorization: `Api-Key ${EMAIL_API_KEY}`,
  },
});

export async function singleSendEmail(options: SendMailOptions) {
  if (EMAIL_DISABLE) return;
  try {
    await mailingAxios.post('/api/send', {
      from: {
        name: EMAIL_FROM_NAME,
        email: '',
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: EMAIL_REPLY_TO,
      queue: EMAIL_QUEUE,
    });
  } catch (error) {
    console.error(`Failed to send email to ${options.to}`, error);
  }
}

type BatchSendEmailOptions = Omit<SendMailOptions, 'to'> & { to: string[] };
export async function batchSendEmail(options: BatchSendEmailOptions) {
  const { to, ...rest } = options;
  try {
    await mailingAxios.post('/api/send-bulk', {
      messages: to.map((email) => ({
        from: {
          name: EMAIL_FROM_NAME,
          email: '',
        },
        to: email,
        subject: rest.subject,
        html: rest.html,
        replyTo: EMAIL_REPLY_TO,
      })),
      queue: EMAIL_QUEUE,
    });
  } catch (error) {
    console.error(`Failed to send email to ${to.length} recipients`, error);
  }
}
