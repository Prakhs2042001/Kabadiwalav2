// src/services/api.ts
// Direct client communication layer with backend REST API and PostgreSQL database

export interface ApiUser {
  id: number;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'HOUSEHOLD' | 'KABADIWALA' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  profile?: any;
}

export interface ApiCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  subcategories: {
    id: number;
    name: string;
    description: string;
    indicativeBaseRate: string;
    unit: string;
  }[];
}

export interface ApiKabadiwala {
  id: number;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  serviceRadiusKm: string;
  verificationStatus: string;
  pickupAvailable: boolean;
  operatingHours: string;
  status: string;
  warehouseName: string;
  warehouseContact: string;
  distanceKm: number;
  isWithinServiceRadius: boolean;
  rating: number;
  reviewCount: number;
  acceptedCategories: string[];
  rates: {
    kabadiwalaId: number;
    categoryId: number;
    categoryName: string;
    ratePerKg: string;
    updatedAt: string;
  }[];
}

export interface ApiPickup {
  id: number;
  bookingNumber: string;
  householdId: number;
  kabadiwalaId: number;
  kabadiwalaName: string;
  kabadiwalaPhone: string;
  warehouseName: string;
  pickupAddress: string;
  scheduledDate: string;
  timeSlot: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'ON_THE_WAY' | 'PICKED_UP' | 'COMPLETED';
  estimatedTotal: string;
  finalTotal?: string;
  notes: string;
  createdAt: string;
  items: {
    id: number;
    categoryId: number;
    categoryName: string;
    subcategoryName: string;
    estimatedWeight: string;
    rateAtBooking: string;
    estimatedAmount: string;
    actualWeight?: string;
    finalRate?: string;
    finalAmount?: string;
  }[];
  timeline: {
    id: number;
    status: string;
    changedBy: string;
    timestamp: string;
    notes: string;
  }[];
}

export const api = {
  // -------------------------------------------------------------
  // AUTHENTICATION
  // -------------------------------------------------------------
  async register(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role: 'HOUSEHOLD' | 'KABADIWALA';
    address?: string;
    area?: string;
    city?: string;
    pinCode?: string;
    businessName?: string;
  }): Promise<{ success: boolean; data?: { user: ApiUser; token: string }; error?: string; message?: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return await res.json();
  },

  async login(credentials: {
    identifier: string;
    password: string;
  }): Promise<{ success: boolean; data?: { user: ApiUser; token: string }; error?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    return await res.json();
  },

  async getMe(): Promise<{ success: boolean; data?: ApiUser; error?: string }> {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    return await res.json();
  },

  async logout(): Promise<{ success: boolean; message?: string }> {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    return await res.json();
  },

  async forgotPassword(identifier: string): Promise<{ success: boolean; message?: string; data?: any; error?: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    return await res.json();
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    return await res.json();
  },

  // -------------------------------------------------------------
  // DISCOVERY & RATES
  // -------------------------------------------------------------
  async getCategories(): Promise<ApiCategory[]> {
    const res = await fetch('/api/categories');
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async searchNearby(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    category?: string;
    pickupAvailable?: boolean;
    sort?: string;
  }): Promise<{ data: ApiKabadiwala[]; totalFound: number }> {
    const searchParams = new URLSearchParams({
      latitude: params.latitude.toString(),
      longitude: params.longitude.toString(),
      radius: (params.radius || 10).toString(),
      category: params.category || '',
      pickupAvailable: params.pickupAvailable ? 'true' : '',
      sort: params.sort || 'distance_asc',
    });

    const res = await fetch(`/api/kabadiwalas/nearby?${searchParams.toString()}`);
    const json = await res.json();
    return {
      data: json.success ? json.data : [],
      totalFound: json.meta?.totalFound || 0,
    };
  },

  async getKabadiwala(id: number): Promise<any> {
    const res = await fetch(`/api/kabadiwalas/${id}`);
    const json = await res.json();
    return json.success ? json.data : null;
  },

  // -------------------------------------------------------------
  // PICKUP BOOKING & TRANSACTIONS
  // -------------------------------------------------------------
  async createPickup(bookingData: {
    kabadiwalaId: number;
    pickupAddress: string;
    scheduledDate: string;
    timeSlot: string;
    notes?: string;
    items: { categoryId: number; estimatedWeight: number }[];
  }): Promise<any> {
    const res = await fetch('/api/pickups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
      credentials: 'include',
    });
    return await res.json();
  },

  async getPickups(filter?: { kabadiwalaId?: number; householdId?: number; status?: string }): Promise<ApiPickup[]> {
    const params = new URLSearchParams();
    if (filter?.kabadiwalaId) params.append('kabadiwalaId', filter.kabadiwalaId.toString());
    if (filter?.householdId) params.append('householdId', filter.householdId.toString());
    if (filter?.status) params.append('status', filter.status);

    const res = await fetch(`/api/pickups?${params.toString()}`, { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async updatePickupStatus(pickupId: number, status: string, notes?: string): Promise<any> {
    const res = await fetch(`/api/pickups/${pickupId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
      credentials: 'include',
    });
    return await res.json();
  },

  async completePickup(
    pickupId: number,
    items: { id: number; actualWeight: number; finalRate: number }[],
    paymentMethod: string = 'UPI',
    notes: string = ''
  ): Promise<any> {
    const res = await fetch(`/api/pickups/${pickupId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, paymentMethod, notes }),
      credentials: 'include',
    });
    return await res.json();
  },

  async submitReview(pickupId: number, rating: number, comment: string): Promise<any> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickupId, rating, comment }),
      credentials: 'include',
    });
    return await res.json();
  },

  // -------------------------------------------------------------
  // ADMIN PLATFORM MANAGEMENT
  // -------------------------------------------------------------
  async getAdminMetrics(): Promise<any> {
    const res = await fetch('/api/admin/metrics', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : null;
  },

  async getAdminUsers(): Promise<ApiUser[]> {
    const res = await fetch('/api/admin/users', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async updateAdminUserStatus(userId: number, status: string): Promise<any> {
    const res = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    return await res.json();
  },

  async getAdminWarehouses(): Promise<any[]> {
    const res = await fetch('/api/admin/warehouses', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async createAdminWarehouse(data: any): Promise<any> {
    const res = await fetch('/api/admin/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    return await res.json();
  },

  async getAdminKabadiwalas(): Promise<any[]> {
    const res = await fetch('/api/admin/kabadiwalas', { credentials: 'include' });
    const json = await res.json();
    return json.success ? json.data : [];
  },

  async verifyKabadiwala(id: number, verificationStatus: string): Promise<any> {
    const res = await fetch(`/api/admin/kabadiwalas/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verificationStatus }),
      credentials: 'include',
    });
    return await res.json();
  },

  async importKabadiwalas(warehouseId: number, rows: any[]): Promise<any> {
    const res = await fetch('/api/admin/kabadiwalas/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warehouseId, rows }),
      credentials: 'include',
    });
    return await res.json();
  },
};
