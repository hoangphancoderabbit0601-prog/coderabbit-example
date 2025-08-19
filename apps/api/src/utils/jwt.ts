import { sign, verify } from 'jsonwebtoken';

import { JWT_EXPIRATION, JWT_SECRET } from '../LoadEnv';

export interface JwtPayload {
  id: bigint;
  email: string;
  name: string;
  started_date: string;
  position_id: number;
}

export const signToken = (data: JwtPayload) => {
  return sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
};

export const verifyToken = (token: string) => {
  return verify(token, JWT_SECRET);
};
