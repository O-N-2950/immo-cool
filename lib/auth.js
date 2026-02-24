/**
 * immo.cool — Auth utilities
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('❌ FATAL: JWT_SECRET environment variable is required. Never use a hardcoded secret.');
}
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '7d';

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Also check cookies
  const cookies = request.headers.get('cookie');
  if (cookies) {
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
    if (tokenCookie) return tokenCookie.split('=')[1];
  }
  return null;
}

export async function authenticate(request) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
