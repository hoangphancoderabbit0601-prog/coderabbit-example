import commandLineArgs from 'command-line-args';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Set environment variables
 */
const env =
  process.env.NODE_ENV ??
  (() => {
    const options = commandLineArgs([
      {
        name: 'env',
        alias: 'e',
        defaultValue: 'local',
        type: String,
      },
    ]);
    return options.env;
  })();

const result = dotenv.config({
  path: path.join(__dirname, `../../../../env/${env}.env`),
});

if (result.error) {
  throw result.error;
}

/**
 * Validate environment variables
 */
const requiredEnv = [
  'PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASS',
  'DB_HOST',
  'DB_PORT',
  'JWT_EXPIRATION',
  'JWT_SECRET',
];

for (const varName of requiredEnv) {
  if (process.env[varName] === undefined) {
    throw new Error(`fatal: env variable [${varName}] is not defined`);
  }
}

/**
 * Export environment variables
 */
export const PORT = Number(process.env.PORT);
export const DB_NAME = String(process.env.DB_NAME);
export const DB_USER = String(process.env.DB_USER);
export const DB_PASS = String(process.env.DB_PASS);
export const DB_HOST = String(process.env.DB_HOST);
export const DB_PORT = Number(process.env.DB_PORT);
export const JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);
export const JWT_SECRET = String(process.env.JWT_SECRET);
