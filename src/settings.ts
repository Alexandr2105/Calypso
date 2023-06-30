import { config } from 'dotenv';
import * as process from 'process';
config();

export const settings = {
  SWAGGER: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || '1234',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '12345',
  TOKEN_LIFE: 3000,
  REFRESH_TOKEN_LIFE: 6000,
  CURRENT_APP_BASE_URL:
    process.env.CURRENT_APP_BASE_URL || 'http://localhost:3000',
  RECOVERY_PASSWORD: process.env.ADDRESS_SITE_FOR_RECOVERY_PASSWORD,
  ADDRESS_SITE_FOR_CONFIRMATION:
    process.env.ADDRESS_SITE_FOR_CONFIRMATION || 'http://localhost:3000',
};
