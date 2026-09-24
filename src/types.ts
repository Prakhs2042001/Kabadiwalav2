/**
 * Production Database & Application Types for Navonmesh
 * Core concept: Partner Warehouses supply verified local kabadiwala network data.
 * The platform enables households to discover, compare, and book nearby service partners.
 */

export type UserRole = 'household' | 'kabadiwala' | 'recycler' | 'admin';

export type WasteCategoryType = 'Paper' | 'Plastic' | 'Metal' | 'E-Waste';
export type WasteCategory = WasteCategoryType | 'Other';

export interface WasteCategoryItem {
  id: string;
  name: WasteCategoryType;
  description: string;
  iconName: string;
  examples: string[];
}

export interface PartnerWarehouse {
  warehouse_id: string;
  name: string;
  location: string;
  area: string;
  city: string;
  state: string;
  pin_code: string;
  latitude: number;
  longitude: number;
  contact_person: string;
  phone: string;
  email: string;
  status: 'Connected' | 'Pending Sync' | 'Inactive';
  connected_kabadiwalas_count: number;
  last_data_update: string;
  created_at: string;
  updated_at: string;
}

export interface KabadiwalaRate {
  rate_id: string;
  kabadiwala_id: string;
  category: WasteCategoryType;
  sub_category: string;
  rate_per_kg: number;
  updated_at: string;
  updated_ago_text?: string;
}

export interface Kabadiwala {
  kabadiwala_id: string;
  warehouse_id: string;
  warehouse_name?: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  locality: string;
  city: string;
  pin_code: string;
  latitude: number;
  longitude: number;
  service_radius: number;
  verification_status: 'Verified' | 'Pending Review' | 'Suspended';
  pickup_available: boolean;
  operating_hours: string;
  status: 'Active' | 'Inactive';
  rating: number;
  review_count: number;
  waste_categories: WasteCategoryType[];
  rates: KabadiwalaRate[];
  rate_managed_by: 'warehouse' | 'kabadiwala';
  created_at: string;
  updated_at: string;
  distance_km?: number;
}

export interface Household {
  household_id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  pin_code: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export type PickupStatus =
  | 'Requested'
  | 'Accepted'
  | 'On the Way'
  | 'Picked Up'
  | 'Completed'
  | 'Cancelled';

export interface PickupItem {
  category: WasteCategoryType;
  sub_category?: string;
  estimated_kg: number;
  rate_per_kg: number;
  calculated_estimate: number;
  actual_kg?: number;
  final_amount?: number;
}

export interface Pickup {
  pickup_id: string;
  household_id: string;
  household_name: string;
  household_phone: string;
  kabadiwala_id: string;
  kabadiwala_name: string;
  kabadiwala_phone: string;
  kabadiwala_area: string;
  warehouse_id: string;
  pickup_address: string;
  area: string;
  pin_code: string;
  latitude?: number;
  longitude?: number;
  scheduled_date: string;
  time_slot: string;
  status: PickupStatus;
  items: PickupItem[];
  estimated_weight: number;
  estimated_value: number;
  actual_weight?: number;
  final_amount?: number;
  special_instructions?: string;
  status_timeline: {
    status: PickupStatus;
    timestamp: string;
    note: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Recycler {
  recycler_id: string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  facility_location: string;
  city: string;
  state: string;
  cpcb_license_number: string;
  materials_accepted: WasteCategoryType[];
  monthly_processing_capacity: string;
  current_procurement_demands: {
    category: WasteCategoryType;
    required_tons: number;
    procurement_price_per_ton: number;
  }[];
  status: 'Active' | 'Auditing';
}

export interface PlatformStats {
  total_partner_warehouses: number;
  total_verified_kabadiwalas: number;
  total_households_registered: number;
  total_pickups_completed: number;
  total_scrap_collected_kg: number;
  total_payout_disbursed: number;
}

/* =========================================================
   Compatible Legacy / Extended Types for UI Helpers & Modals
   ========================================================= */

export type TransactionStatus =
  | 'PICKUP_REQUESTED'
  | 'COLLECTOR_ASSIGNED'
  | 'PICKUP_SCHEDULED'
  | 'MATERIAL_WEIGHED'
  | 'HANDOVER_CONFIRMED'
  | 'RECYCLER_RECEIVED'
  | 'CANCELLED'
  | 'requested'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface TransactionStep {
  status: TransactionStatus;
  title: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  actor: string;
  detail?: any;
}

export interface PriceHistoryPoint {
  day: string;
  rate: number;
}

export interface MaterialRate {
  id: string;
  name: string;
  category: WasteCategory;
  indicativeRate: number;
  unit: string;
  lastUpdatedMins: number;
  trend: 'up' | 'down' | 'stable';
  change24h: number;
  history7Days: PriceHistoryPoint[];
  description: string;
  acceptedItems: string[];
  tips: string;
}

export interface Collector {
  id: string;
  name: string;
  businessName?: string;
  badgeText?: string;
  isVerified?: boolean;
  hasDigitalScale?: boolean;
  activeYears?: number;
  avatarSeed?: string;
  indicativeRateAvailability?: boolean | string;
  phone: string;
  photoUrl?: string;
  experienceYears?: number;
  distanceKm: number;
  locality: string;
  materialsAccepted: WasteCategory[];
  indicativeRates?: { [key in WasteCategory]?: number };
  availableSlots: string[];
  vehicleType?: 'Electric Cart (E-Rickshaw)' | 'Cycle Cart' | 'Mini Tempo' | 'Hand Cart' | string;
  verificationBadge?: boolean;
  governmentIdType?: 'Aadhaar Verified' | 'Voter ID Verified' | string;
  rating?: number;
  completedPickups?: number;
  weighingScaleType?: 'Digital Hanging Scale (Calibrated)' | 'Platform Electronic Scale' | string;
  languagesSpoken?: string[];
}

export interface WeighedItem {
  materialId: string;
  materialName: string;
  category: WasteCategory;
  weightKg: number;
  ratePerKg: number;
  totalAmount: number;
}

export interface Transaction {
  id: string;
  createdAt?: string;
  pickupDate?: string;
  date?: string;
  timeSlot: string;
  wasteCategory?: WasteCategory;
  category?: WasteCategory;
  subMaterial?: string;
  approximateWeight?: number;
  actualWeight?: number;
  actualWeightKg?: number;
  indicativeRate?: number;
  finalRate?: number;
  finalValue?: number;
  finalPayout?: number;
  customerName: string;
  customerPhone: string;
  pickupAddress?: string;
  address?: string;
  collectorId?: string;
  collectorName?: string;
  collector?: Collector;
  status: TransactionStatus;
  currentStep?: string;
  timeline?: TransactionStep[];
  paymentMode?: string;
  handoverCode?: string;
  weighingScalePhotoUrl?: string;
  digitalReceiptId?: string;
  recyclerDestinationId?: string;
  recyclerDestinationName?: string;
  recyclerEstimatedDeliveryDate?: string;
  recyclerId?: string;
  recyclerName?: string;
  recyclerFacility?: string;
  recyclerDispatchBatch?: string;
  estimatedWeightKg?: number;
  itemsWeighed?: WeighedItem[];
  qrCodeHash?: string;
}

export interface RecyclerDestination {
  id: string;
  name?: string;
  facilityName?: string;
  category: WasteCategory;
  location: string;
  city?: string;
  state?: string;
  materialsHandled?: string[];
  authorizedBy?: string;
  cpcbLicenseNumber?: string;
  capacityPerDayTons?: number;
  capacityMonthly?: string;
  processDescription?: string;
  primaryEndProducts?: string[];
  monthlyRecoveryRatePercent?: number;
  traceabilityBatchPrefix?: string;
}

export interface SocietyData {
  societyName: string;
  address?: string;
  pinCode?: string;
  totalFlats: number;
  activeFlats?: number;
  participatingFlats?: number;
  nextDriveDate?: string;
  monthlyTotals: {
    paperKg: number;
    plasticKg: number;
    metalKg: number;
    eWasteKg: number;
    otherKg?: number;
    totalEarnings?: number;
    documentedPercentage?: number;
  };
  assignedCollectorName?: string;
  assignedCollectorPhone?: string;
  assignedCollectorId?: string;
  upcomingPickup?: {
    date: string;
    timeSlot: string;
    targetFlats?: number;
    registeredFlats?: number;
    collectorName?: string;
  };
}

export interface AdminMetrics {
  totalPickupsCompleted?: number;
  totalWasteDivertedKg?: number;
  totalHouseholdsActive?: number;
  activeCollectors?: number;
  averageTransactionValue?: number;
  digitalWeightConfidenceRate?: number;
  totalHouseholds: number;
  totalCollectors: number;
  recyclerPartners: number;
  totalPickups: number;
  totalMaterialRoutedKg: number;
  documentedHandoversPercentage: number;
  repeatUsersPercentage: number;
  rejectedMaterialKg: number;
  weeklyVolume?: { week: string; kg?: number; routedKg?: number; documentedKg?: number }[];
  categoryBreakdown: {
    category: WasteCategory;
    percentage: number;
    tons?: number;
    kg: number;
  }[];
}
