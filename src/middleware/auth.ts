// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService, UserSessionPayload } from '../server/auth.service.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { adminAuth } from '../lib/firebase-admin.ts';

export interface AuthRequest extends Request {
  user?: UserSessionPayload | any;
  dbUser?: typeof users.$inferSelect;
}

// Extract JWT token from HttpOnly cookie or Authorization Bearer header
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.cookies?.kc_token;

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split('Bearer ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Please log in to continue.' });
  }

  // 1. Try verifying backend JWT
  const verifiedJwt = AuthService.verifyToken(token);
  if (verifiedJwt) {
    const dbUsers = await db.select().from(users).where(eq(users.id, verifiedJwt.userId)).limit(1);
    if (dbUsers.length > 0) {
      req.user = verifiedJwt;
      req.dbUser = dbUsers[0];
      return next();
    }
  }

  // 2. Fallback: Firebase ID token if token was provided via Firebase Google login
  try {
    const decodedFirebase = await adminAuth.verifyIdToken(token);
    const dbUsers = await db.select().from(users).where(eq(users.uid, decodedFirebase.uid)).limit(1);
    if (dbUsers.length > 0) {
      req.user = {
        userId: dbUsers[0].id,
        uid: dbUsers[0].uid,
        email: dbUsers[0].email,
        name: dbUsers[0].name,
        role: dbUsers[0].role,
        status: dbUsers[0].status,
      };
      req.dbUser = dbUsers[0];
      return next();
    }
  } catch {
    // Both failed
  }

  return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session.' });
};

// Require specific roles
export const requireRole = (allowedRoles: Array<'HOUSEHOLD' | 'KABADIWALA' | 'ADMIN'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.dbUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No active session.' });
    }

    if (!allowedRoles.includes(req.dbUser.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access restricted to ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
};

export const requireHousehold = requireRole(['HOUSEHOLD']);
export const requireKabadiwala = requireRole(['KABADIWALA']);
export const requireAdmin = requireRole(['ADMIN']);
