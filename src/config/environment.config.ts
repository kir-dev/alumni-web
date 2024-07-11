import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

export const SITE_URL = env.get('SITE_URL').required().asString();
export const NEXTAUTH_SECRET = env.get('NEXTAUTH_SECRET').required().asString();

export const EMAIL_HOST = env.get('EMAIL_HOST').required().asString();
export const EMAIL_PORT = env.get('EMAIL_PORT').required().asPortNumber();
export const EMAIL_SECURE = env.get('EMAIL_SECURE').required().asBool();
export const EMAIL_USERNAME = env.get('EMAIL_USERNAME').required().asString();
export const EMAIL_PASSWORD = env.get('EMAIL_PASSWORD').required().asString();
export const EMAIL_FROM_NAME = env.get('EMAIL_FROM_NAME').required().asString();
export const EMAIL_FROM_ADDRESS = env.get('EMAIL_FROM_ADDRESS').required().asString();

env
  .get('OPENAI_API_KEY')
  .required(Boolean(env.get('NEXT_PUBLIC_AI_ENABLED')))
  .asString();

export const VERCEL_PROJECT_ID = env.get('VERCEL_PROJECT_ID').required().asString();
export const VERCEL_TEAM_ID = env.get('VERCEL_TEAM_ID').required().asString();
export const VERCEL_API_TOKEN = env.get('VERCEL_API_TOKEN').required().asString();
