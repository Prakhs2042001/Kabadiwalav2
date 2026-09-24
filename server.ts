import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { db } from './src/db/index.ts';
import {
  users,
  partnerWarehouses,
  kabadiwalas,
  wasteCategories,
  wasteSubcategories,
  kabadiwalaRates,
  households,
  householdAddresses,
  pickups,
  pickupItems,
  pickupStatusHistory,
  transactions,
  reviews,
  platformSettings,
  notifications,
  passwordResetTokens,
} from './src/db/schema.ts';
import { eq, desc, and, inArray, sql, count, or, gt, isNull } from 'drizzle-orm';
import { AuthService } from './src/server/auth.service.ts';
import { requireAuth, requireRole, requireAdmin } from './src/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// In-memory rate limiter for auth routes
const authAttempts = new Map<string, { count: number; resetAt: number }>();
function authRateLimiter(req: any, res: any, next: any) {
  const ip = req.ip || req.connection.remoteAddress || 'client';
  const now = Date.now();
  const record = authAttempts.get(ip);

  if (record && record.resetAt > now) {
    if (record.count >= 15) {
      return res.status(429).json({
        success: false,
        error: 'Too many login attempts. Please try again in 5 minutes.',
      });
    }
    record.count++;
  } else {
    authAttempts.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
  }
  next();
}

// Haversine distance calculator in kilometers
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Cookie helper
function setAuthCookie(res: any, token: string) {
  res.cookie('kc_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearAuthCookie(res: any) {
  res.clearCookie('kc_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

// -------------------------------------------------------------
// AUTHENTICATION API ROUTES (POSTGRESQL & BCRYPT)
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', authRateLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, role, address, area, city, pinCode, businessName } = req.body;

    // Strict Backend Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, email, password, and account type.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    if (!['HOUSEHOLD', 'KABADIWALA'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid account type. Only Household or Kabadiwala accounts may register.',
      });
    }

    const createdUser = await AuthService.registerUser({
      name,
      email,
      phone: phone || '',
      password,
      role,
      address,
      area,
      city,
      pinCode,
      businessName,
    });

    const token = AuthService.generateToken({
      userId: createdUser.id,
      uid: createdUser.uid,
      email: createdUser.email,
      name: createdUser.name,
      role: createdUser.role,
      status: createdUser.status,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message:
        createdUser.role === 'KABADIWALA'
          ? 'Registration received! Your Kabadiwala account is awaiting verification by Platform Admin.'
          : 'Registration successful! Welcome to Kabadiwala Connect.',
      data: {
        token,
        user: {
          id: createdUser.id,
          uid: createdUser.uid,
          name: createdUser.name,
          email: createdUser.email,
          phone: createdUser.phone,
          role: createdUser.role,
          status: createdUser.status,
        },
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ success: false, error: error.message || 'Registration failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', authRateLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your email/phone and password.',
      });
    }

    const user = await AuthService.findByIdentifier(identifier);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email/phone or password.',
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'This account was created via external identity. Please reset password to enable password login.',
      });
    }

    const match = await AuthService.comparePassword(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email/phone or password.',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been suspended. Please contact support.',
      });
    }

    if (user.status === 'PENDING' && user.role === 'KABADIWALA') {
      return res.status(403).json({
        success: false,
        error: 'Your Kabadiwala account is awaiting verification from the platform administration.',
      });
    }

    // Update last login
    await AuthService.updateLastLogin(user.id);

    const token = AuthService.generateToken({
      userId: user.id,
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    });

    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          uid: user.uid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          lastLoginAt: user.lastLoginAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'An unexpected authentication error occurred.' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, async (req: any, res) => {
  try {
    const user = req.dbUser;
    let extraProfile = null;

    if (user.role === 'HOUSEHOLD') {
      const hList = await db.select().from(households).where(eq(households.userId, user.id)).limit(1);
      extraProfile = hList[0] || null;
    } else if (user.role === 'KABADIWALA') {
      const kList = await db.select().from(kabadiwalas).where(eq(kabadiwalas.userId, user.id)).limit(1);
      extraProfile = kList[0] || null;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        profile: extraProfile,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', authRateLimiter, async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Please enter your email or phone.' });
    }

    const user = await AuthService.findByIdentifier(identifier);
    if (!user) {
      // Return success message to prevent user enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been generated.',
      });
    }

    const rawToken = await AuthService.createPasswordResetToken(user.id);

    res.json({
      success: true,
      message: 'Password reset link generated.',
      data: {
        resetToken: rawToken,
        instructions: 'Use this reset token with POST /api/auth/reset-password to set a new password.',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', authRateLimiter, async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token or password (must be at least 6 characters).',
      });
    }

    await AuthService.resetPasswordWithToken(token, newPassword);
    res.json({ success: true, message: 'Your password has been successfully updated! You can now log in.' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message || 'Password reset failed.' });
  }
});

// -------------------------------------------------------------
// PUBLIC & DISCOVERY API ROUTES
// -------------------------------------------------------------

// 1. Get all waste categories with subcategories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.select().from(wasteCategories).where(eq(wasteCategories.status, 'ACTIVE'));
    const subcategories = await db.select().from(wasteSubcategories);

    const result = categories.map((cat) => ({
      ...cat,
      subcategories: subcategories.filter((s) => s.categoryId === cat.id),
    }));

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch categories' });
  }
});

// 2. Nearby Kabadiwalas search with geospatial filtering & rates
app.get('/api/kabadiwalas/nearby', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = '10',
      category,
      pickupAvailable,
      sort = 'distance_asc',
    } = req.query;

    const userLat = parseFloat(latitude as string) || 23.6889;
    const userLon = parseFloat(longitude as string) || 86.9833;
    const searchRadius = parseFloat(radius as string) || 10;

    // Fetch active, verified Kabadiwalas with their partner warehouse info
    const allKabadiwalas = await db
      .select({
        id: kabadiwalas.id,
        businessName: kabadiwalas.businessName,
        ownerName: kabadiwalas.ownerName,
        phone: kabadiwalas.phone,
        email: kabadiwalas.email,
        address: kabadiwalas.address,
        area: kabadiwalas.area,
        locality: kabadiwalas.locality,
        city: kabadiwalas.city,
        state: kabadiwalas.state,
        pinCode: kabadiwalas.pinCode,
        latitude: kabadiwalas.latitude,
        longitude: kabadiwalas.longitude,
        serviceRadiusKm: kabadiwalas.serviceRadiusKm,
        verificationStatus: kabadiwalas.verificationStatus,
        pickupAvailable: kabadiwalas.pickupAvailable,
        operatingHours: kabadiwalas.operatingHours,
        status: kabadiwalas.status,
        warehouseName: partnerWarehouses.name,
        warehouseContact: partnerWarehouses.contactPhone,
      })
      .from(kabadiwalas)
      .innerJoin(partnerWarehouses, eq(kabadiwalas.warehouseId, partnerWarehouses.id))
      .where(
        and(
          eq(kabadiwalas.status, 'ACTIVE'),
          eq(kabadiwalas.verificationStatus, 'VERIFIED')
        )
      );

    // Fetch all active rates
    const rates = await db
      .select({
        kabadiwalaId: kabadiwalaRates.kabadiwalaId,
        categoryId: kabadiwalaRates.categoryId,
        categoryName: wasteCategories.name,
        ratePerKg: kabadiwalaRates.ratePerKg,
        updatedAt: kabadiwalaRates.updatedAt,
      })
      .from(kabadiwalaRates)
      .innerJoin(wasteCategories, eq(kabadiwalaRates.categoryId, wasteCategories.id))
      .where(eq(kabadiwalaRates.status, 'ACTIVE'));

    // Fetch review ratings
    const allReviews = await db.select().from(reviews);

    // Calculate distance and filter by service radius & query radius
    let nearbyList = allKabadiwalas
      .map((k) => {
        const kLat = parseFloat(k.latitude);
        const kLon = parseFloat(k.longitude);
        const distance = calculateHaversineDistance(userLat, userLon, kLat, kLon);
        const serviceRadius = parseFloat(k.serviceRadiusKm) || 5;

        // Collect rates for this kabadiwala
        const kRates = rates.filter((r) => r.kabadiwalaId === k.id);
        const acceptedCategories = Array.from(new Set(kRates.map((r) => r.categoryName)));

        // Rating average
        const kReviews = allReviews.filter((rv) => rv.kabadiwalaId === k.id);
        const rating =
          kReviews.length > 0
            ? Math.round((kReviews.reduce((sum, r) => sum + r.rating, 0) / kReviews.length) * 10) / 10
            : 4.8;

        return {
          ...k,
          distanceKm: distance,
          isWithinServiceRadius: distance <= serviceRadius,
          rates: kRates,
          acceptedCategories,
          rating,
          reviewCount: kReviews.length,
        };
      })
      .filter((k) => {
        // Distance must be within search radius and within Kabadiwala's service radius
        if (k.distanceKm > searchRadius) return false;
        if (!k.isWithinServiceRadius) return false;
        if (pickupAvailable === 'true' && !k.pickupAvailable) return false;

        // Filter by category if requested
        if (category && typeof category === 'string' && category !== 'all') {
          const catLower = category.toLowerCase();
          const hasCategory = k.acceptedCategories.some((c) => c.toLowerCase() === catLower);
          if (!hasCategory) return false;
        }

        return true;
      });

    // Sorting
    if (sort === 'rate_desc') {
      nearbyList.sort((a, b) => {
        const maxRateA = Math.max(...a.rates.map((r) => parseFloat(r.ratePerKg) || 0), 0);
        const maxRateB = Math.max(...b.rates.map((r) => parseFloat(r.ratePerKg) || 0), 0);
        return maxRateB - maxRateA;
      });
    } else if (sort === 'rating_desc') {
      nearbyList.sort((a, b) => b.rating - a.rating);
    } else {
      nearbyList.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json({
      success: true,
      meta: {
        totalFound: nearbyList.length,
        userCoordinates: { latitude: userLat, longitude: userLon },
        radiusKm: searchRadius,
      },
      data: nearbyList,
    });
  } catch (error: any) {
    console.error('Error fetching nearby kabadiwalas:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch nearby kabadiwalas' });
  }
});

// 3. Kabadiwala detail profile & current rates
app.get('/api/kabadiwalas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const kData = await db
      .select({
        kabadiwala: kabadiwalas,
        warehouse: partnerWarehouses,
      })
      .from(kabadiwalas)
      .innerJoin(partnerWarehouses, eq(kabadiwalas.warehouseId, partnerWarehouses.id))
      .where(eq(kabadiwalas.id, id))
      .limit(1);

    if (!kData || kData.length === 0) {
      return res.status(404).json({ success: false, error: 'Kabadiwala not found' });
    }

    const rates = await db
      .select({
        rate: kabadiwalaRates,
        category: wasteCategories,
      })
      .from(kabadiwalaRates)
      .innerJoin(wasteCategories, eq(kabadiwalaRates.categoryId, wasteCategories.id))
      .where(and(eq(kabadiwalaRates.kabadiwalaId, id), eq(kabadiwalaRates.status, 'ACTIVE')));

    const kReviews = await db
      .select({
        review: reviews,
        userName: users.name,
      })
      .from(reviews)
      .innerJoin(households, eq(reviews.householdId, households.id))
      .innerJoin(users, eq(households.userId, users.id))
      .where(eq(reviews.kabadiwalaId, id))
      .orderBy(desc(reviews.createdAt));

    res.json({
      success: true,
      data: {
        ...kData[0].kabadiwala,
        warehouse: kData[0].warehouse,
        rates: rates.map((r) => ({
          ...r.rate,
          categoryName: r.category.name,
        })),
        reviews: kReviews.map((rv) => ({
          id: rv.review.id,
          rating: rv.review.rating,
          comment: rv.review.comment,
          createdAt: rv.review.createdAt,
          reviewerName: rv.userName,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// HOUSEHOLD BOOKINGS & PICKUP APIS
// -------------------------------------------------------------

// Schedule a pickup
app.post('/api/pickups', async (req: any, res) => {
  try {
    const {
      householdId,
      kabadiwalaId,
      pickupAddress,
      scheduledDate,
      timeSlot,
      notes = '',
      items,
    } = req.body;

    if (!kabadiwalaId || !pickupAddress || !scheduledDate || !timeSlot || !items || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required booking fields (kabadiwalaId, pickupAddress, scheduledDate, timeSlot, items)',
      });
    }

    // Resolve household
    let effectiveHouseholdId = householdId;
    if (!effectiveHouseholdId) {
      const hList = await db.select().from(households).limit(1);
      effectiveHouseholdId = hList[0]?.id;
    }

    // Check kabadiwala
    const kList = await db.select().from(kabadiwalas).where(eq(kabadiwalas.id, kabadiwalaId)).limit(1);
    if (!kList || kList.length === 0) {
      return res.status(404).json({ success: false, error: 'Kabadiwala does not exist' });
    }
    const kabadiwala = kList[0];
    if (!kabadiwala.pickupAvailable || kabadiwala.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        error: 'This Kabadiwala is currently unavailable for doorstep pickups.',
      });
    }

    // Fetch current rates for snapshot
    const currentRates = await db
      .select({
        categoryId: kabadiwalaRates.categoryId,
        ratePerKg: kabadiwalaRates.ratePerKg,
        categoryName: wasteCategories.name,
      })
      .from(kabadiwalaRates)
      .innerJoin(wasteCategories, eq(kabadiwalaRates.categoryId, wasteCategories.id))
      .where(and(eq(kabadiwalaRates.kabadiwalaId, kabadiwalaId), eq(kabadiwalaRates.status, 'ACTIVE')));

    const rateMap = new Map(currentRates.map((r) => [r.categoryId, r]));

    let calculatedEstimatedTotal = 0;
    const itemsToInsert: any[] = [];

    for (const it of items) {
      const rateInfo = rateMap.get(it.categoryId);
      const rateAtBooking = rateInfo ? parseFloat(rateInfo.ratePerKg) : 15.0;
      const categoryName = rateInfo ? rateInfo.categoryName : 'General Scrap';
      const weight = parseFloat(it.estimatedWeight) || 5;
      const estimatedAmount = Math.round(weight * rateAtBooking * 100) / 100;
      calculatedEstimatedTotal += estimatedAmount;

      itemsToInsert.push({
        categoryId: it.categoryId,
        categoryName,
        estimatedWeight: weight.toFixed(2),
        rateAtBooking: rateAtBooking.toFixed(2),
        estimatedAmount: estimatedAmount.toFixed(2),
      });
    }

    const timestampSuffix = Date.now().toString().slice(-4);
    const bookingNumber = `KC-${new Date().getFullYear()}-${timestampSuffix}`;

    const newPickup = await db
      .insert(pickups)
      .values({
        bookingNumber,
        householdId: effectiveHouseholdId,
        kabadiwalaId,
        pickupAddress,
        scheduledDate,
        timeSlot,
        status: 'REQUESTED',
        estimatedTotal: calculatedEstimatedTotal.toFixed(2),
        notes,
      })
      .returning();

    const createdPickup = newPickup[0];

    for (const item of itemsToInsert) {
      await db.insert(pickupItems).values({
        pickupId: createdPickup.id,
        ...item,
      });
    }

    await db.insert(pickupStatusHistory).values({
      pickupId: createdPickup.id,
      status: 'REQUESTED',
      changedBy: 'HOUSEHOLD',
      notes: 'Pickup request scheduled by household',
    });

    if (kabadiwala.userId) {
      await db.insert(notifications).values({
        userId: kabadiwala.userId,
        title: 'New Pickup Request',
        message: `New pickup request ${bookingNumber} scheduled for ${scheduledDate} (${timeSlot}) at ${pickupAddress}.`,
        link: `/kabadiwala?pickupId=${createdPickup.id}`,
      });
    }

    res.json({
      success: true,
      message: 'Pickup scheduled successfully!',
      data: {
        id: createdPickup.id,
        bookingNumber: createdPickup.bookingNumber,
        estimatedTotal: createdPickup.estimatedTotal,
        status: createdPickup.status,
      },
    });
  } catch (error: any) {
    console.error('Error creating pickup:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to create pickup' });
  }
});

// Get pickups
app.get('/api/pickups', async (req, res) => {
  try {
    const { householdId, kabadiwalaId, status } = req.query;

    let query = db
      .select({
        pickup: pickups,
        kabadiwalaName: kabadiwalas.businessName,
        kabadiwalaPhone: kabadiwalas.phone,
        warehouseName: partnerWarehouses.name,
      })
      .from(pickups)
      .innerJoin(kabadiwalas, eq(pickups.kabadiwalaId, kabadiwalas.id))
      .innerJoin(partnerWarehouses, eq(kabadiwalas.warehouseId, partnerWarehouses.id))
      .orderBy(desc(pickups.createdAt));

    const allPickups = await query;
    let filtered = allPickups;

    if (householdId) {
      filtered = filtered.filter((p) => p.pickup.householdId === parseInt(householdId as string));
    }
    if (kabadiwalaId) {
      filtered = filtered.filter((p) => p.pickup.kabadiwalaId === parseInt(kabadiwalaId as string));
    }
    if (status) {
      filtered = filtered.filter((p) => p.pickup.status === status);
    }

    const pickupIds = filtered.map((p) => p.pickup.id);
    const items = pickupIds.length > 0 ? await db.select().from(pickupItems).where(inArray(pickupItems.pickupId, pickupIds)) : [];
    const statusLogs = pickupIds.length > 0 ? await db.select().from(pickupStatusHistory).where(inArray(pickupStatusHistory.pickupId, pickupIds)) : [];

    const result = filtered.map((p) => ({
      ...p.pickup,
      kabadiwalaName: p.kabadiwalaName,
      kabadiwalaPhone: p.kabadiwalaPhone,
      warehouseName: p.warehouseName,
      items: items.filter((it) => it.pickupId === p.pickup.id),
      timeline: statusLogs.filter((l) => l.pickupId === p.pickup.id),
    }));

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update pickup status
app.patch('/api/pickups/:id/status', async (req, res) => {
  try {
    const pickupId = parseInt(req.params.id);
    const { status, notes = '', changedBy = 'KABADIWALA' } = req.body;

    const validStatuses = ['REQUESTED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'ON_THE_WAY', 'PICKED_UP', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid pickup status' });
    }

    const updated = await db
      .update(pickups)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(pickups.id, pickupId))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }

    await db.insert(pickupStatusHistory).values({
      pickupId,
      status,
      changedBy,
      notes,
    });

    res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete Pickup
app.post('/api/pickups/:id/complete', async (req, res) => {
  try {
    const pickupId = parseInt(req.params.id);
    const { items, paymentMethod = 'UPI', notes = '' } = req.body;

    const pickupRecord = (await db.select().from(pickups).where(eq(pickups.id, pickupId)).limit(1))[0];
    if (!pickupRecord) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }

    let totalWeight = 0;
    let totalAmount = 0;

    for (const it of items) {
      const actualWeight = parseFloat(it.actualWeight) || 0;
      const finalRate = parseFloat(it.finalRate) || 0;
      const finalAmount = Math.round(actualWeight * finalRate * 100) / 100;

      totalWeight += actualWeight;
      totalAmount += finalAmount;

      await db
        .update(pickupItems)
        .set({
          actualWeight: actualWeight.toFixed(2),
          finalRate: finalRate.toFixed(2),
          finalAmount: finalAmount.toFixed(2),
        })
        .where(eq(pickupItems.id, it.id));
    }

    await db
      .update(pickups)
      .set({
        status: 'COMPLETED',
        finalTotal: totalAmount.toFixed(2),
        notes: notes || pickupRecord.notes,
        updatedAt: new Date(),
      })
      .where(eq(pickups.id, pickupId));

    await db.insert(pickupStatusHistory).values({
      pickupId,
      status: 'COMPLETED',
      changedBy: 'KABADIWALA',
      notes: `Completed pickup. Digital scale total: ${totalWeight.toFixed(2)} kg, Payout: ₹${totalAmount.toFixed(2)}`,
    });

    const receiptNumber = `REC-KC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${pickupId}`;
    const transactionRecord = await db
      .insert(transactions)
      .values({
        pickupId,
        householdId: pickupRecord.householdId,
        kabadiwalaId: pickupRecord.kabadiwalaId,
        totalWeightKg: totalWeight.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        paymentMethod,
        receiptNumber,
        digitalScaleVerified: true,
      })
      .onConflictDoUpdate({
        target: transactions.pickupId,
        set: {
          totalWeightKg: totalWeight.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paymentMethod,
        },
      })
      .returning();

    res.json({
      success: true,
      message: 'Pickup successfully completed and transaction recorded!',
      data: {
        pickupId,
        finalTotal: totalAmount.toFixed(2),
        totalWeightKg: totalWeight.toFixed(2),
        receiptNumber,
        transaction: transactionRecord[0],
      },
    });
  } catch (error: any) {
    console.error('Error completing pickup:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit review
app.post('/api/reviews', async (req, res) => {
  try {
    const { pickupId, rating, comment } = req.body;

    const pickup = (await db.select().from(pickups).where(eq(pickups.id, pickupId)).limit(1))[0];
    if (!pickup) {
      return res.status(404).json({ success: false, error: 'Pickup not found' });
    }
    if (pickup.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, error: 'Reviews are only permitted for completed pickups' });
    }

    const inserted = await db
      .insert(reviews)
      .values({
        pickupId,
        householdId: pickup.householdId,
        kabadiwalaId: pickup.kabadiwalaId,
        rating: parseInt(rating) || 5,
        comment: comment || '',
      })
      .returning();

    res.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// ADMIN MANAGEMENT & PARTNER WAREHOUSES APIS (PROTECTED)
// -------------------------------------------------------------

// Admin Dashboard Analytics
app.get('/api/admin/metrics', requireAuth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await db.select({ count: count() }).from(users);
    const totalHouseholds = await db.select({ count: count() }).from(households);
    const activeKabadiwalas = await db.select({ count: count() }).from(kabadiwalas).where(eq(kabadiwalas.status, 'ACTIVE'));
    const pendingKabadiwalas = await db.select({ count: count() }).from(kabadiwalas).where(eq(kabadiwalas.verificationStatus, 'PENDING'));
    const totalWarehouses = await db.select({ count: count() }).from(partnerWarehouses);
    const pendingPickups = await db.select({ count: count() }).from(pickups).where(eq(pickups.status, 'REQUESTED'));
    const completedPickups = await db.select({ count: count() }).from(pickups).where(eq(pickups.status, 'COMPLETED'));

    const allTransactions = await db.select().from(transactions);
    const totalTransactionValue = allTransactions.reduce((sum, t) => sum + parseFloat(t.totalAmount || '0'), 0);
    const totalScrapWeight = allTransactions.reduce((sum, t) => sum + parseFloat(t.totalWeightKg || '0'), 0);

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers[0]?.count || 0,
        totalHouseholds: totalHouseholds[0]?.count || 0,
        activeKabadiwalas: activeKabadiwalas[0]?.count || 0,
        pendingKabadiwalas: pendingKabadiwalas[0]?.count || 0,
        totalWarehouses: totalWarehouses[0]?.count || 0,
        pendingPickups: pendingPickups[0]?.count || 0,
        completedPickups: completedPickups[0]?.count || 0,
        totalTransactionValue: Math.round(totalTransactionValue),
        totalScrapWeightKg: Math.round(totalScrapWeight),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Users List
app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        uid: users.uid,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        status: users.status,
        emailVerified: users.emailVerified,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    res.json({ success: true, data: allUsers });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Update User Status (Activate, Deactivate, Suspend)
app.patch('/api/admin/users/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE', 'SUSPENDED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const updated = await db
      .update(users)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Partner Warehouses CRUD
app.get('/api/admin/warehouses', requireAuth, requireAdmin, async (req, res) => {
  try {
    const warehouses = await db.select().from(partnerWarehouses).orderBy(desc(partnerWarehouses.createdAt));
    const allKabadiwalas = await db.select().from(kabadiwalas);

    const result = warehouses.map((w) => ({
      ...w,
      connectedKabadiwalasCount: allKabadiwalas.filter((k) => k.warehouseId === w.id).length,
    }));

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/warehouses', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, location, area, city, state, pinCode, contactName, contactPhone, contactEmail } = req.body;
    const inserted = await db
      .insert(partnerWarehouses)
      .values({
        name,
        location,
        area,
        city,
        state,
        pinCode,
        contactName,
        contactPhone,
        contactEmail,
        status: 'ACTIVE',
      })
      .returning();
    res.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Kabadiwalas list
app.get('/api/admin/kabadiwalas', requireAuth, requireAdmin, async (req, res) => {
  try {
    const kList = await db
      .select({
        kabadiwala: kabadiwalas,
        warehouseName: partnerWarehouses.name,
      })
      .from(kabadiwalas)
      .innerJoin(partnerWarehouses, eq(kabadiwalas.warehouseId, partnerWarehouses.id))
      .orderBy(desc(kabadiwalas.createdAt));

    const rates = await db.select().from(kabadiwalaRates).where(eq(kabadiwalaRates.status, 'ACTIVE'));

    const result = kList.map((item) => ({
      ...item.kabadiwala,
      warehouseName: item.warehouseName,
      rates: rates.filter((r) => r.kabadiwalaId === item.kabadiwala.id),
    }));

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin toggle Kabadiwala verification / approval
app.patch('/api/admin/kabadiwalas/:id/verify', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { verificationStatus } = req.body; // 'VERIFIED' | 'PENDING' | 'SUSPENDED'

    const targetK = (await db.select().from(kabadiwalas).where(eq(kabadiwalas.id, id)).limit(1))[0];
    if (!targetK) {
      return res.status(404).json({ success: false, error: 'Kabadiwala not found' });
    }

    const updated = await db
      .update(kabadiwalas)
      .set({
        verificationStatus,
        status: verificationStatus === 'VERIFIED' ? 'ACTIVE' : targetK.status,
        pickupAvailable: verificationStatus === 'VERIFIED' ? true : targetK.pickupAvailable,
        lastVerifiedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(kabadiwalas.id, id))
      .returning();

    // If user account is associated, sync user status
    if (targetK.userId) {
      await db
        .update(users)
        .set({
          status: verificationStatus === 'VERIFIED' ? 'ACTIVE' : 'PENDING',
          updatedAt: new Date(),
        })
        .where(eq(users.id, targetK.userId));
    }

    res.json({ success: true, data: updated[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Import Kabadiwala Records from Partner Warehouse
app.post('/api/admin/kabadiwalas/import', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { warehouseId, rows } = req.body;
    if (!warehouseId || !rows || !Array.isArray(rows)) {
      return res.status(400).json({ success: false, error: 'Missing warehouseId or rows array' });
    }

    const wh = (await db.select().from(partnerWarehouses).where(eq(partnerWarehouses.id, warehouseId)).limit(1))[0];
    if (!wh) {
      return res.status(404).json({ success: false, error: 'Partner warehouse not found' });
    }

    const categories = await db.select().from(wasteCategories);
    const paperCat = categories.find((c) => c.name === 'Paper') || categories[0];
    const plasticCat = categories.find((c) => c.name === 'Plastic') || categories[0];
    const metalCat = categories.find((c) => c.name === 'Metal') || categories[0];

    const insertedKabadiwalas = [];

    for (const row of rows) {
      const inserted = await db
        .insert(kabadiwalas)
        .values({
          warehouseId,
          businessName: row.businessName || 'Scrap Collector',
          ownerName: row.ownerName || 'Operator',
          phone: row.phone || '+91 98000 00000',
          email: row.email || '',
          address: row.address || wh.location,
          area: row.area || wh.area,
          locality: row.locality || '',
          city: row.city || wh.city,
          state: row.state || wh.state,
          pinCode: row.pinCode || wh.pinCode,
          latitude: (row.latitude || 23.6889).toString(),
          longitude: (row.longitude || 86.9833).toString(),
          serviceRadiusKm: (row.serviceRadiusKm || 5).toString(),
          verificationStatus: 'VERIFIED',
          pickupAvailable: true,
          operatingHours: '9:00 AM – 6:00 PM',
          status: 'ACTIVE',
          source: 'WAREHOUSE_CSV_IMPORT',
          sourceReference: `WH-${warehouseId}-${Date.now().toString().slice(-4)}`,
        })
        .returning();

      const k = inserted[0];
      if (k) {
        await db.insert(kabadiwalaRates).values([
          { kabadiwalaId: k.id, categoryId: paperCat.id, ratePerKg: row.paperRate || '16.00' },
          { kabadiwalaId: k.id, categoryId: plasticCat.id, ratePerKg: row.plasticRate || '22.00' },
          { kabadiwalaId: k.id, categoryId: metalCat.id, ratePerKg: row.metalRate || '35.00' },
        ]);
        insertedKabadiwalas.push(k);
      }
    }

    res.json({
      success: true,
      message: `Successfully imported ${insertedKabadiwalas.length} Kabadiwalas from Partner Warehouse: ${wh.name}`,
      data: insertedKabadiwalas,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// VITE SPA DEV SERVER INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kabadiwala Connect Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
