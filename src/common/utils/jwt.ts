import * as jwt from 'jsonwebtoken';
import { getEnvValue } from '../config/config.loader';

export function generateToken({ sub }: { sub: number }) {
  const payload = { sub };
  const secret = getEnvValue('JWT_SECRET');
  const token = jwt.sign(payload, secret, {
    expiresIn: `${1}h`,
  });
  return token;
}
