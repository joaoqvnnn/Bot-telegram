import { env } from './env';
export const securityConfig = {
  jwt: { secret: env.JWT_SECRET, expiresIn: '7d' },
  bcrypt: { rounds: 10 },
  rateLimit: { windowMs: 900000, max: 100 },
};
export default securityConfig;
