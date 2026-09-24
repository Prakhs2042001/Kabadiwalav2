import React, { useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  PartnerWarehouse,
  Kabadiwala,
  Pickup,
  Recycler,
  WasteCategoryType,
  MaterialRate,
  PickupStatus
} from './types';
import {
  INITIAL_WAREHOUSES,
  INITIAL_KABADIWALAS,
  INITIAL_HOUSEHOLDS,
  INITIAL_PICKUPS,
  INITIAL_RECYCLERS
} from './data/seedData';
import { INITIAL_RATES } from './data/mockData';
import { calculateDistanceKm, PRESET_LOCATIONS } from './utils/geo';

// UI Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroLanding } from './components/HeroLanding';
import { AuthModal } from './components/auth/AuthModal';
import { LocationStep } from './components/household/LocationStep';
import { CategorySelectStep } from './components/household/CategorySelectStep';
import { KabadiwalaDiscovery } from './components/household/KabadiwalaDiscovery';
import { KabadiwalaProfileModal } from './components/household/KabadiwalaProfileModal';
import { SchedulePickupModal } from './components/household/SchedulePickupModal';
import { HouseholdDashboard } from './components/household/HouseholdDashboard';
import { KabadiwalaDashboard } from './components/kabadiwala/KabadiwalaDashboard';
import { RecyclerDashboard } from './components/recycler/RecyclerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RatesScreen } from './components/RatesScreen';
import { AssistedBookingModal } from './components/AssistedBookingModal';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();

  // Role & Authentication State
  const [currentRole, setCurrentRole] = useState<UserRole>('household');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAssistedModal, setShowAssistedModal] = useState<boolean>(false);

  // Active View Routing
  const [activeView, setActiveView] = useState<string>('home');

  // Synchronize authenticated user role to current view
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        setCurrentRole('admin');
      } else if (user.role === 'KABADIWALA') {
        setCurrentRole('kabadiwala');
      } else {
        setCurrentRole('household');
      }
    }
  }, [user]);

  // Household Location State (Section 6)
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    area: string;
    city: string;
    pin_code: string;
    isManual: boolean;
  }>({
    lat: 23.6841,
    lng: 86.9734,
    area: 'Burnpur Road',
    city: 'Asansol',
    pin_code: '713325',
    isManual: false
  });

  // Discovery Sub-step: 'location' | 'category' | 'list'
  const [discoveryStep, setDiscoveryStep] = useState<'location' | 'category' | 'list'>('location');

  // Household Waste Category Selection State (Section 8: Multi-select)
  const [selectedCategories, setSelectedCategories] = useState<WasteCategoryType[]>(['Metal', 'Plastic']);

  // Data Store State (LocalStorage backed)
  const [warehouses, setWarehouses] = useState<PartnerWarehouse[]>(() => {
    const saved = localStorage.getItem('kc_warehouses_v2');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  const [kabadiwalas, setKabadiwalas] = useState<Kabadiwala[]>(() => {
    const saved = localStorage.getItem('kc_kabadiwalas_v2');
    return saved ? JSON.parse(saved) : INITIAL_KABADIWALAS;
  });

  const [pickups, setPickups] = useState<Pickup[]>(() => {
    const saved = localStorage.getItem('kc_pickups_v2');
    return saved ? JSON.parse(saved) : INITIAL_PICKUPS;
  });

  const [recyclers] = useState<Recycler[]>(INITIAL_RECYCLERS);
  const [rates] = useState<MaterialRate[]>(INITIAL_RATES);

  // Modal inspection states
  const [inspectingKabadiwala, setInspectingKabadiwala] = useState<Kabadiwala | null>(null);
  const [bookingKabadiwala, setBookingKabadiwala] = useState<Kabadiwala | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('kc_warehouses_v2', JSON.stringify(warehouses));
  }, [warehouses]);

  useEffect(() => {
    localStorage.setItem('kc_kabadiwalas_v2', JSON.stringify(kabadiwalas));
  }, [kabadiwalas]);

  useEffect(() => {
    localStorage.setItem('kc_pickups_v2', JSON.stringify(pickups));
  }, [pickups]);

  // Compute live distance between user and each Kabadiwala using Haversine formula
  const enrichedKabadiwalas = useMemo(() => {
    return kabadiwalas.map((k) => {
      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        k.latitude,
        k.longitude
      );
      // Link warehouse name if not already set
      const wh = warehouses.find((w) => w.warehouse_id === k.warehouse_id);
      return {
        ...k,
        distance_km: dist,
        warehouse_name: wh ? wh.name : k.warehouse_name || 'Partner Hub'
      };
    });
  }, [kabadiwalas, userLocation, warehouses]);

  // Count how many Kabadiwalas match current category selection
  const matchingKabadiwalasCount = useMemo(() => {
    return enrichedKabadiwalas.filter((k) => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.every((cat) => k.waste_categories.includes(cat));
    }).length;
  }, [enrichedKabadiwalas, selectedCategories]);

  // Toggle Category
  const handleToggleCategory = (category: WasteCategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Switch Role Handler
  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'household') {
      setActiveView('household_dashboard');
    } else if (role === 'kabadiwala') {
      setActiveView('kabadiwala_dashboard');
    } else if (role === 'recycler') {
      setActiveView('recycler_dashboard');
    } else if (role === 'admin') {
      setActiveView('admin_dashboard');
    }
  };

  // Household booking creation
  const handleConfirmBooking = (newPickupData: any) => {
    const newPickup: Pickup = {
      ...newPickupData,
      pickup_id: `KC-PK-${Math.floor(1000 + Math.random() * 9000)}`,
      status_timeline: [
        {
          status: 'Requested',
          timestamp: 'Just now',
          note: 'Doorstep pickup booked via verified partner warehouse network'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setPickups((prev) => [newPickup, ...prev]);
  };

  // Update pickup lifecycle status (Used by Kabadiwala & Household)
  const handleUpdatePickupStatus = (
    pickupId: string,
    newStatus: PickupStatus,
    actualKg?: number,
    finalAmount?: number
  ) => {
    setPickups((prev) =>
      prev.map((p) => {
        if (p.pickup_id !== pickupId) return p;

        const timelineEntry = {
          status: newStatus,
          timestamp: 'Just now',
          note:
            newStatus === 'Accepted'
              ? 'Kabadiwala accepted the pickup request'
              : newStatus === 'On the Way'
              ? 'Collector is on the way with calibrated digital scale'
              : newStatus === 'Completed'
              ? `Weighed ${actualKg || p.estimated_weight} kg. Final payment settled: ₹${
                  finalAmount || p.estimated_value
                }.`
              : 'Pickup cancelled'
        };

        return {
          ...p,
          status: newStatus,
          actual_weight: actualKg !== undefined ? actualKg : p.actual_weight,
          final_amount: finalAmount !== undefined ? finalAmount : p.final_amount,
          status_timeline: [...p.status_timeline, timelineEntry],
          updated_at: new Date().toISOString()
        };
      })
    );
  };

  // Admin Actions
  const handleAddWarehouse = (newWarehouse: PartnerWarehouse) => {
    setWarehouses((prev) => [newWarehouse, ...prev]);
  };

  const handleToggleWarehouseStatus = (warehouseId: string) => {
    setWarehouses((prev) =>
      prev.map((w) =>
        w.warehouse_id === warehouseId
          ? {
              ...w,
              status: w.status === 'Connected' ? 'Inactive' : 'Connected',
              updated_at: new Date().toISOString()
            }
          : w
      )
    );
  };

  const handleToggleKabadiwalaVerification = (kabadiwalaId: string) => {
    setKabadiwalas((prev) =>
      prev.map((k) =>
        k.kabadiwala_id === kabadiwalaId
          ? {
              ...k,
              verification_status:
                k.verification_status === 'Verified' ? 'Suspended' : 'Verified'
            }
          : k
      )
    );
  };

  const handleUpdateKabadiwalaRadius = (kabadiwalaId: string, newRadius: number) => {
    setKabadiwalas((prev) =>
      prev.map((k) =>
        k.kabadiwala_id === kabadiwalaId ? { ...k, service_radius: newRadius } : k
      )
    );
  };

  const handleImportWarehouseData = () => {
    // Ingest fresh mock data / refresh timestamps
    setKabadiwalas((prev) =>
      prev.map((k) => ({
        ...k,
        updated_at: new Date().toISOString(),
        rates: k.rates.map((r) => ({
          ...r,
          updated_ago_text: 'Just now'
        }))
      }))
    );
  };

  // Find Kabadiwala Near Me CTA handler
  const handleStartDiscovery = () => {
    setActiveView('discovery');
    setDiscoveryStep('location');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#f0fdff,_#e0f7fb_30%,_#d5f0fa_100%)] text-slate-900 selection:bg-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'discovery') setDiscoveryStep('location');
        }}
        activeView={activeView}
        userLocationName={`${userLocation.area}, ${userLocation.city}`}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE (Sections 3 & 4) */}
        {activeView === 'home' && (
          <HeroLanding
            onFindKabadiwala={handleStartDiscovery}
            onOpenLogin={() => setShowLoginModal(true)}
            onSelectCategory={(cat) => {
              setSelectedCategories([cat]);
              setActiveView('discovery');
              setDiscoveryStep('list');
            }}
          />
        )}

        {/* VIEW 2: HOUSEHOLD EXPERIENCE / DISCOVERY FLOW (Sections 6, 7, 8, 9) */}
        {activeView === 'discovery' && (
          <div className="space-y-6">
            {discoveryStep === 'location' && (
              <LocationStep
                currentLocation={userLocation}
                onLocationSelected={(loc) => {
                  setUserLocation(loc);
                  setDiscoveryStep('category');
                }}
                onContinueToCategories={() => setDiscoveryStep('category')}
              />
            )}

            {discoveryStep === 'category' && (
              <CategorySelectStep
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                onContinue={() => setDiscoveryStep('list')}
                onBack={() => setDiscoveryStep('location')}
                totalMatchingKabadiwalas={matchingKabadiwalasCount}
              />
            )}

            {discoveryStep === 'list' && (
              <KabadiwalaDiscovery
                kabadiwalas={enrichedKabadiwalas}
                selectedCategories={selectedCategories}
                userLocation={userLocation}
                onViewProfile={(k) => setInspectingKabadiwala(k)}
                onSchedulePickup={(k) => setBookingKabadiwala(k)}
                onBackToCategories={() => setDiscoveryStep('category')}
              />
            )}
          </div>
        )}

        {/* VIEW 3: HOUSEHOLD DASHBOARD (Section 12) */}
        {activeView === 'household_dashboard' && (
          <HouseholdDashboard
            pickups={pickups}
            nearbyKabadiwalasCount={matchingKabadiwalasCount}
            onFindKabadiwalas={handleStartDiscovery}
            onCancelPickup={(pId) => handleUpdatePickupStatus(pId, 'Cancelled')}
            onViewKabadiwalaProfile={(kId) => {
              const match = enrichedKabadiwalas.find((k) => k.kabadiwala_id === kId);
              if (match) setInspectingKabadiwala(match);
            }}
          />
        )}

        {/* VIEW 4: KABADIWALA DASHBOARD (Sections 13 & 14) */}
        {activeView === 'kabadiwala_dashboard' && (
          <KabadiwalaDashboard
            kabadiwala={enrichedKabadiwalas[0] || kabadiwalas[0]}
            pickups={pickups}
            onUpdatePickupStatus={handleUpdatePickupStatus}
          />
        )}

        {/* VIEW 5: RECYCLER DASHBOARD (Section 20 - Distinct Industrial Entity) */}
        {activeView === 'recycler_dashboard' && (
          <RecyclerDashboard recycler={recyclers[0]} />
        )}

        {/* VIEW 6: PLATFORM ADMIN CONSOLE (Sections 15 & 16) */}
        {activeView === 'admin_dashboard' && (
          <AdminDashboard
            warehouses={warehouses}
            kabadiwalas={enrichedKabadiwalas}
            onAddWarehouse={handleAddWarehouse}
            onToggleWarehouseStatus={handleToggleWarehouseStatus}
            onToggleKabadiwalaVerification={handleToggleKabadiwalaVerification}
            onUpdateKabadiwalaRadius={handleUpdateKabadiwalaRadius}
            onImportWarehouseData={handleImportWarehouseData}
          />
        )}

        {/* VIEW 7: SCRAP RATES INDEX (Section 3 Price Transparency) */}
        {activeView === 'rates' && (
          <RatesScreen
            rates={rates}
            onBookMaterial={(cat) => {
              const matchedCat = (['Paper', 'Plastic', 'Metal', 'E-Waste'].includes(cat)
                ? cat
                : 'Paper') as WasteCategoryType;
              setSelectedCategories([matchedCat]);
              setActiveView('discovery');
              setDiscoveryStep('list');
            }}
          />
        )}
      </main>

      {/* Footer with platform positioning */}
      <Footer
        onNavigate={(view) => {
          setActiveView(view);
          if (view === 'discovery') setDiscoveryStep('location');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      {/* Role Selection & Real Authentication Modal */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccessRoleRedirect={(role) => {
          if (role === 'ADMIN') {
            setCurrentRole('admin');
            setActiveView('admin_dashboard');
          } else if (role === 'KABADIWALA') {
            setCurrentRole('kabadiwala');
            setActiveView('kabadiwala_dashboard');
          } else {
            setCurrentRole('household');
            setActiveView('household_dashboard');
          }
        }}
      />

      {/* Kabadiwala Profile Modal (Section 10) */}
      <KabadiwalaProfileModal
        kabadiwala={inspectingKabadiwala}
        onClose={() => setInspectingKabadiwala(null)}
        onSchedulePickup={(k) => {
          setInspectingKabadiwala(null);
          setBookingKabadiwala(k);
        }}
      />

      {/* Doorstep Pickup Scheduling Modal (Section 11) */}
      <SchedulePickupModal
        kabadiwala={bookingKabadiwala}
        selectedCategories={selectedCategories}
        userLocation={userLocation}
        onClose={() => setBookingKabadiwala(null)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Low Literacy Assisted Booking Fallback Modal */}
      {showAssistedModal && (
        <AssistedBookingModal
          onClose={() => setShowAssistedModal(false)}
          onBookThroughApp={() => {
            setShowAssistedModal(false);
            handleStartDiscovery();
          }}
        />
      )}
    </div>
  );
}
