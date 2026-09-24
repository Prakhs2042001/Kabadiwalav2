// src/server/auth.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.ts';
import { users, households, kabadiwalas, partnerWarehouses, passwordResetTokens } from '../db/schema.ts';
import { eq, or, and, gt, isNull } from 'drizzle-orm';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'kabadiwala-connect-super-secret-production-key-2026';
const JWT_EXPIRES_IN = '7d';

export interface UserSessionPayload {
  userId: number;
  uid: string;
  email: string;
  name: string;
  role: 'HOUSEHOLD' | 'KABADIWALA' | 'ADMIN';
  status: string;
}

export class AuthService {
  // Hash password with bcrypt
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare plain password with bcrypt hash
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Sign JWT token
  static generateToken(payload: UserSessionPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  static verifyToken(token: string): UserSessionPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
    } catch {
      return null;
    }
  }

  // Find user by email or phone
  static async findByIdentifier(identifier: string) {
    const clean = identifier.trim().toLowerCase();
    const result = await db
      .select()
      .from(users)
      .where(or(eq(users.email, clean), eq(users.phone, identifier.trim())))
      .limit(1);

    return result[0] || null;
  }

  // Find user by ID
  static async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  }

  // Create new User and associated profile (Household or Kabadiwala)
  static async registerUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'HOUSEHOLD' | 'KABADIWALA';
    address?: string;
    area?: string;
    city?: string;
    pinCode?: string;
    businessName?: string;
  }) {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim();

    // Check if email or phone already registered
    const existing = await this.findByIdentifier(cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    if (cleanPhone) {
      const existingPhone = await this.findByIdentifier(cleanPhone);
      if (existingPhone) {
        throw new Error('An account with this phone number already exists.');
      }
    }

    let warehouseId: number | undefined;
    if (data.role === 'KABADIWALA') {
      const availableWarehouses = await db
        .select({ id: partnerWarehouses.id })
        .from(partnerWarehouses)
        .where(eq(partnerWarehouses.status, 'ACTIVE'))
        .limit(1);

      if (!availableWarehouses[0]) {
        throw new Error('Kabadiwala registration is temporarily unavailable because no partner warehouse has been configured.');
      }

      warehouseId = availableWarehouses[0].id;
    }

    const passwordHash = await this.hashPassword(data.password);
    const uid = `kc_usr_${crypto.randomBytes(8).toString('hex')}`;

    // Kabadiwala registered publicly is set to PENDING verification
    const userStatus = data.role === 'KABADIWALA' ? 'PENDING' : 'ACTIVE';

    const insertedUsers = await db
      .insert(users)
      .values({
        uid,
        name: data.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role: data.role,
        status: userStatus,
      })
      .returning();

    const createdUser = insertedUsers[0];

    // Create corresponding profile
    if (data.role === 'HOUSEHOLD') {
      await db.insert(households).values({
        userId: createdUser.id,
        address: data.address || 'Address pending setup',
        area: data.area || 'Burnpur',
        city: data.city || 'Asansol',
        state: 'West Bengal',
        pinCode: data.pinCode || '713325',
      });
    } else if (data.role === 'KABADIWALA') {
      await db.insert(kabadiwalas).values({
        userId: createdUser.id,
        warehouseId: warehouseId!,
        businessName: data.businessName || `${data.name}'s Scrap Depot`,
        ownerName: data.name,
        phone: cleanPhone,
        email: cleanEmail,
        address: data.address || 'Address pending review',
        area: data.area || 'Local Area',
        city: data.city || 'Asansol',
        state: 'West Bengal',
        pinCode: data.pinCode || '713325',
        latitude: '23.688900',
        longitude: '86.983300',
        serviceRadiusKm: '5.00',
        verificationStatus: 'PENDING',
        pickupAvailable: false,
        status: 'PENDING',
        source: 'PUBLIC_PORTAL_REGISTRATION',
      });
    }

    return createdUser;
  }

  // Update last login timestamp
  static async updateLastLogin(userId: number) {
    await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Create password reset token
  static async createPasswordResetToken(userId: number): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await db.insert(passwordResetTokens).values({
      userId,
      tokenHash,
      expiresAt,
    });

    return rawToken;
  }

  // Reset password using token
  static async resetPasswordWithToken(rawToken: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const validTokens = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          gt(passwordResetTokens.expiresAt, new Date()),
          isNull(passwordResetTokens.usedAt)
        )
      )
      .limit(1);

    if (validTokens.length === 0) {
      throw new Error('Invalid or expired password reset link.');
    }

    const resetRecord = validTokens[0];
    const newHash = await this.hashPassword(newPassword);

    await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, resetRecord.userId));
    await db
      .update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, resetRecord.id));

    return true;
  }
}
