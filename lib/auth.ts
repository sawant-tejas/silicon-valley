import jwt from 'jsonwebtoken';

export type AuthTokenPayload = {
  id: string;
};

export function signAuthToken(payload: AuthTokenPayload) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

export function verifyAuthToken(token: string) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  return jwt.verify(token, jwtSecret) as AuthTokenPayload;
}
