import * as dotenv from 'dotenv';
dotenv.config();

export function getEnvValue(key: string): any {
  return process.env[key] || '';
}

export function isLocal(): boolean {
  return getEnvValue('CONFIG_PROFILE') === 'local';
}
