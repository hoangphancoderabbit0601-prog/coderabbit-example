import { logError } from '@/utils/logger';

const API_ENDPOINT = <string>import.meta.env.VITE_API_ENDPOINT;
if (API_ENDPOINT === undefined) {
  logError('API_ENDPOINT is not defined!');
}

if (import.meta.env.VITE_REFRESH_TOKEN_TIMEOUT === undefined) {
  logError('REFRESH_TOKEN_TIMEOUT is not defined!');
}
const REFRESH_TOKEN_TIMEOUT = Number(
  import.meta.env.VITE_REFRESH_TOKEN_TIMEOUT,
);

const PAGINATION_LIMIT = Number(import.meta.env.VITE_PAGINATION_LIMIT || 10);

export { API_ENDPOINT, PAGINATION_LIMIT, REFRESH_TOKEN_TIMEOUT };
