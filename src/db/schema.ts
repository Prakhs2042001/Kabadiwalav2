// src/db/schema.ts
import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['HOUSEHOLD', 'KABADIWALA', 'ADMIN']);
export const userStatusEnum = pgEnum('user_status', ['ACTIVE', 'SUSPENDED', 'PENDING']);
export const warehouseStatusEnum = pgEnum('warehouse_status', ['ACTIVE', 'INACTIVE', 'PENDING']);
export const verificationStatusEnum = pgEnum('verification_status', ['VERIFIED', 'PENDING', 'SUSPENDED']);
export const pickupStatusEnum = pgEnum('pickup_status', [
  'REQUESTED',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'ON_THE_WAY',
  'PICKED_UP',
  'COMPLETED',
]);

// Users Table (Central identity linked via PostgreSQL Authentication)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Unique identifier or Auth UID
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull().default(''),
  passwordHash: text('password_hash'), // Bcrypt hashed password
  role: userRoleEnum('role').notNull().default('HOUSEHOLD'),
  status: userStatusEnum('status').notNull().default('ACTIVE'),
  emailVerified: boolean('email_verified').notNull().default(false),
  phoneVerified: boolean('phone_verified').notNull().default(false),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Partner Warehouses (Local data and network partner supplying Kabadiwala records)
export const partnerWarehouses = pgTable('partner_warehouses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  area: text('area').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  contactName: text('contact_name').notNull(),
  contactPhone: text('contact_phone').notNull(),
  contactEmail: text('contact_email').notNull(),
  status: warehouseStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Kabadiwalas (Scrap Collectors/Dealers tied to supplying Partner Warehouse)
export const kabadiwalas = pgTable('kabadiwalas', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  warehouseId: integer('warehouse_id')
    .references(() => partnerWarehouses.id)
    .notNull(),
  businessName: text('business_name').notNull(),
  ownerName: text('owner_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().default(''),
  address: text('address').notNull(),
  area: text('area').notNull(),
  locality: text('locality').notNull().default(''),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 6 }).notNull(),
  serviceRadiusKm: decimal('service_radius_km', { precision: 5, scale: 2 }).notNull().default('5.00'),
  verificationStatus: verificationStatusEnum('verification_status').notNull().default('VERIFIED'),
  pickupAvailable: boolean('pickup_available').notNull().default(true),
  operatingHours: text('operating_hours').notNull().default('9:00 AM – 7:00 PM'),
  status: userStatusEnum('status').notNull().default('ACTIVE'),
  source: text('source').notNull().default('WAREHOUSE_IMPORT'),
  sourceReference: text('source_reference').notNull().default(''),
  lastVerifiedAt: timestamp('last_verified_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Waste Categories
export const wasteCategories = pgTable('waste_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(), // e.g. Paper, Plastic, Metal, E-Waste
  description: text('description').notNull().default(''),
  icon: text('icon').notNull().default('Recycle'),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Waste Subcategories
export const wasteSubcategories = pgTable('waste_subcategories', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => wasteCategories.id)
    .notNull(),
  name: text('name').notNull(), // e.g. Newspaper, PET Bottles, Copper
  description: text('description').notNull().default(''),
  indicativeBaseRate: decimal('indicative_base_rate', { precision: 8, scale: 2 }).notNull().default('20.00'),
  unit: text('unit').notNull().default('kg'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Kabadiwala Rates (Historical & Current item rates per kg)
export const kabadiwalaRates = pgTable('kabadiwala_rates', {
  id: serial('id').primaryKey(),
  kabadiwalaId: integer('kabadiwala_id')
    .references(() => kabadiwalas.id)
    .notNull(),
  categoryId: integer('category_id')
    .references(() => wasteCategories.id)
    .notNull(),
  subcategoryId: integer('subcategory_id').references(() => wasteSubcategories.id),
  ratePerKg: decimal('rate_per_kg', { precision: 8, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('INR'),
  effectiveFrom: timestamp('effective_from').defaultNow().notNull(),
  effectiveUntil: timestamp('effective_until'),
  updatedBy: text('updated_by').notNull().default('WAREHOUSE_SYNC'),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Household Profile
export const households = pgTable('households', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull()
    .unique(),
  address: text('address').notNull(),
  area: text('area').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 6 }).notNull().default('23.6889'),
  longitude: decimal('longitude', { precision: 10, scale: 6 }).notNull().default('86.9833'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Household Saved Addresses
export const householdAddresses = pgTable('household_addresses', {
  id: serial('id').primaryKey(),
  householdId: integer('household_id')
    .references(() => households.id)
    .notNull(),
  label: text('label').notNull().default('Home'),
  address: text('address').notNull(),
  area: text('area').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 6 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 6 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Pickups Table
export const pickups = pgTable('pickups', {
  id: serial('id').primaryKey(),
  bookingNumber: text('booking_number').notNull().unique(), // e.g. KC-2026-0012
  householdId: integer('household_id')
    .references(() => households.id)
    .notNull(),
  kabadiwalaId: integer('kabadiwala_id')
    .references(() => kabadiwalas.id)
    .notNull(),
  addressId: integer('address_id').references(() => householdAddresses.id),
  pickupAddress: text('pickup_address').notNull(),
  scheduledDate: text('scheduled_date').notNull(), // YYYY-MM-DD
  timeSlot: text('time_slot').notNull(), // e.g. "10:00 AM - 12:00 PM"
  status: pickupStatusEnum('status').notNull().default('REQUESTED'),
  estimatedTotal: decimal('estimated_total', { precision: 10, scale: 2 }).notNull().default('0.00'),
  finalTotal: decimal('final_total', { precision: 10, scale: 2 }),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Pickup Items (Stores snapshot rate at booking & actual weights after scale weighing)
export const pickupItems = pgTable('pickup_items', {
  id: serial('id').primaryKey(),
  pickupId: integer('pickup_id')
    .references(() => pickups.id)
    .notNull(),
  categoryId: integer('category_id')
    .references(() => wasteCategories.id)
    .notNull(),
  subcategoryId: integer('subcategory_id').references(() => wasteSubcategories.id),
  categoryName: text('category_name').notNull(),
  subcategoryName: text('subcategory_name').notNull().default(''),
  estimatedWeight: decimal('estimated_weight', { precision: 8, scale: 2 }).notNull(),
  rateAtBooking: decimal('rate_at_booking', { precision: 8, scale: 2 }).notNull(),
  estimatedAmount: decimal('estimated_amount', { precision: 10, scale: 2 }).notNull(),
  actualWeight: decimal('actual_weight', { precision: 8, scale: 2 }),
  finalRate: decimal('final_rate', { precision: 8, scale: 2 }),
  finalAmount: decimal('final_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Pickup Status History Timeline
export const pickupStatusHistory = pgTable('pickup_status_history', {
  id: serial('id').primaryKey(),
  pickupId: integer('pickup_id')
    .references(() => pickups.id)
    .notNull(),
  status: pickupStatusEnum('status').notNull(),
  changedBy: text('changed_by').notNull(), // 'HOUSEHOLD', 'KABADIWALA', 'ADMIN'
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  notes: text('notes').notNull().default(''),
});

// Transactions Record (Financial & Handover Proof)
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  pickupId: integer('pickup_id')
    .references(() => pickups.id)
    .notNull()
    .unique(),
  householdId: integer('household_id')
    .references(() => households.id)
    .notNull(),
  kabadiwalaId: integer('kabadiwala_id')
    .references(() => kabadiwalas.id)
    .notNull(),
  totalWeightKg: decimal('total_weight_kg', { precision: 8, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull().default('CASH_OR_UPI'),
  receiptNumber: text('receipt_number').notNull().unique(),
  digitalScaleVerified: boolean('digital_scale_verified').notNull().default(true),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

// Reviews / Ratings
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  pickupId: integer('pickup_id')
    .references(() => pickups.id)
    .notNull()
    .unique(),
  householdId: integer('household_id')
    .references(() => households.id)
    .notNull(),
  kabadiwalaId: integer('kabadiwala_id')
    .references(() => kabadiwalas.id)
    .notNull(),
  rating: integer('rating').notNull(), // 1 to 5
  comment: text('comment').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// In-app Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('PICKUP_UPDATE'),
  read: boolean('read').notNull().default(false),
  link: text('link').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
});

// Platform Settings (Admin configurable maximum search radius, commission, etc.)
export const platformSettings = pgTable('platform_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description').notNull().default(''),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Password Reset Tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Database Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  household: one(households, { fields: [users.id], references: [households.userId] }),
  kabadiwala: one(kabadiwalas, { fields: [users.id], references: [kabadiwalas.userId] }),
  notifications: many(notifications),
}));

export const partnerWarehousesRelations = relations(partnerWarehouses, ({ many }) => ({
  kabadiwalas: many(kabadiwalas),
}));

export const kabadiwalasRelations = relations(kabadiwalas, ({ one, many }) => ({
  warehouse: one(partnerWarehouses, { fields: [kabadiwalas.warehouseId], references: [partnerWarehouses.id] }),
  user: one(users, { fields: [kabadiwalas.userId], references: [users.id] }),
  rates: many(kabadiwalaRates),
  pickups: many(pickups),
  reviews: many(reviews),
}));

export const wasteCategoriesRelations = relations(wasteCategories, ({ many }) => ({
  subcategories: many(wasteSubcategories),
  rates: many(kabadiwalaRates),
}));

export const wasteSubcategoriesRelations = relations(wasteSubcategories, ({ one, many }) => ({
  category: one(wasteCategories, { fields: [wasteSubcategories.categoryId], references: [wasteCategories.id] }),
  rates: many(kabadiwalaRates),
}));

export const kabadiwalaRatesRelations = relations(kabadiwalaRates, ({ one }) => ({
  kabadiwala: one(kabadiwalas, { fields: [kabadiwalaRates.kabadiwalaId], references: [kabadiwalas.id] }),
  category: one(wasteCategories, { fields: [kabadiwalaRates.categoryId], references: [wasteCategories.id] }),
  subcategory: one(wasteSubcategories, { fields: [kabadiwalaRates.subcategoryId], references: [wasteSubcategories.id] }),
}));

export const householdsRelations = relations(households, ({ one, many }) => ({
  user: one(users, { fields: [households.userId], references: [users.id] }),
  addresses: many(householdAddresses),
  pickups: many(pickups),
  reviews: many(reviews),
}));

export const householdAddressesRelations = relations(householdAddresses, ({ one }) => ({
  household: one(households, { fields: [householdAddresses.householdId], references: [households.id] }),
}));

export const pickupsRelations = relations(pickups, ({ one, many }) => ({
  household: one(households, { fields: [pickups.householdId], references: [households.id] }),
  kabadiwala: one(kabadiwalas, { fields: [pickups.kabadiwalaId], references: [kabadiwalas.id] }),
  items: many(pickupItems),
  statusHistory: many(pickupStatusHistory),
  transaction: one(transactions, { fields: [pickups.id], references: [transactions.pickupId] }),
  review: one(reviews, { fields: [pickups.id], references: [reviews.pickupId] }),
}));

export const pickupItemsRelations = relations(pickupItems, ({ one }) => ({
  pickup: one(pickups, { fields: [pickupItems.pickupId], references: [pickups.id] }),
  category: one(wasteCategories, { fields: [pickupItems.categoryId], references: [wasteCategories.id] }),
}));

export const pickupStatusHistoryRelations = relations(pickupStatusHistory, ({ one }) => ({
  pickup: one(pickups, { fields: [pickupStatusHistory.pickupId], references: [pickups.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  pickup: one(pickups, { fields: [transactions.pickupId], references: [pickups.id] }),
  household: one(households, { fields: [transactions.householdId], references: [households.id] }),
  kabadiwala: one(kabadiwalas, { fields: [transactions.kabadiwalaId], references: [kabadiwalas.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  pickup: one(pickups, { fields: [reviews.pickupId], references: [pickups.id] }),
  household: one(households, { fields: [reviews.householdId], references: [households.id] }),
  kabadiwala: one(kabadiwalas, { fields: [reviews.kabadiwalaId], references: [kabadiwalas.id] }),
}));
