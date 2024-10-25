import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const SITE_URL = env.get('SITE_URL').required().asString();
export const NEXTAUTH_SECRET = env.get('NEXTAUTH_SECRET').required().asString();

export const EMAIL_HOST = env.get('EMAIL_HOST').required().asString();
export const EMAIL_API_KEY = env.get('EMAIL_API_KEY').required().asString();
export const EMAIL_FROM_NAME = env.get('EMAIL_FROM_NAME').required().asString();
export const EMAIL_QUEUE = env.get('EMAIL_QUEUE').required().asString();
export const EMAIL_REPLY_TO = env.get('EMAIL_REPLY_TO').asString();

env
  .get('OPENAI_API_KEY')
  .required(Boolean(env.get('NEXT_PUBLIC_AI_ENABLED')))
  .asString();

export const VERCEL_PROJECT_ID = env.get('VERCEL_PROJECT_ID').required().asString();
export const VERCEL_TEAM_ID = env.get('VERCEL_TEAM_ID').required().asString();
export const VERCEL_API_TOKEN = env.get('VERCEL_API_TOKEN').required().asString();

export const EMAIL_DISABLE = env.get('EMAIL_DISABLE').default('false').asBool();

export const ANALYTICS_URL = env.get('ANALYTICS_URL').asString();

export const GOOGLE_SITE_VERIFICATION = env.get('GOOGLE_SITE_VERIFICATION').asString();
