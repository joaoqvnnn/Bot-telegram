import dotenv from 'dotenv';
dotenv.config();
export const env = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
};
export default env;
