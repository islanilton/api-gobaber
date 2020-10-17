import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded: TokenPayload = verify(
      token,
      authConfig.jwt.secret,
    ) as TokenPayload;

    request.user = {
      id: decoded.sub,
    };
    return next();
  } catch {
    throw Error('Invalid JWT Token');
  }
}
