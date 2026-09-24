import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Scale,
  Calculator,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Kabadiwala, WasteCategoryType, Pickup, PickupItem } from '../../types';
import { api } from '../../services/api';

interface SchedulePickupModalProps {
  kabadiwala: Kabadiwala | null;
  selectedCategories: WasteCategoryType[];
  userLocation: { area: string; city: string; pin_code: string; lat?: number; lng?: number };
  onClose: () => void;
  onConfirmBooking: (pickupData: any) => void;
}

export const SchedulePickupModal: React.FC<SchedulePickupModalProps> = ({
  kabadiwala,
  selectedCategories,
  userLocation,
  onClose,
  onConfirmBooking
}) => {
  if (!kabadiwala) return null;

  // Categories to include in booking: user's selected categories that this kabadiwala accepts
  const activeCategories = (
    selectedCategories.length > 0 ? selectedCategories : kabadiwala.waste_categories
  ).filter((cat) => kabadiwala.waste_categories.includes(cat));

  // State for estimated kg per category
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    activeCategories.forEach((cat) => {
      init[cat] = cat === 'Metal' ? 10 : cat === 'Plastic' ? 5 : cat === 'Paper' ? 15 : 2;
    });
    return init;
  });

  const [customerName, setCustomerName] = useState('Rahul Verma');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [pickupAddress, setPickupAddress] = useState(
    `Flat 402, Green Valley Enclave, ${userLocation.area}, ${userLocation.city}`
  );
  const [scheduledDate, setScheduledDate] = useState('Tomorrow, 25 Sep 2026');
  const [timeSlot, setTimeSlot] = useState('10:00 AM – 12:00 PM');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Please bring a calibrated digital hanging scale. Intercom at main gate is 402.'
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculate items with rates and estimated totals
  const pickupItems: PickupItem[] = activeCategories.map((cat) => {
    const rateObj = kabadiwala.rates.find((r) => r.category === cat);
    const rate = rateObj ? rateObj.rate_per_kg : 20;
    const kg = quantities[cat] || 1;
    const itemTotal = Math.round(kg * rate);

    return {
      category: cat,
      sub_category: rateObj?.sub_category || `${cat} scrap`,
      estimated_kg: kg,
      rate_per_kg: rate,
      calculated_estimate: itemTotal
    };
  });

  const totalEstimatedWeight = pickupItems.reduce((sum, item) => sum + item.estimated_kg, 0);
  const totalEstimatedValue = pickupItems.reduce((sum, item) => sum + item.calculated_estimate, 0);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Map category name to database category id (Paper: 1, Plastic: 2, Metal: 3, E-Waste: 4)
      const categoryIdMap: Record<string, number> = {
        Paper: 1,
        Plastic: 2,
        Metal: 3,
        'E-Waste': 4,
      };

      const numericKabadiwalaId = parseInt(kabadiwala.kabadiwala_id.replace(/\D/g, '')) || 1;

      const payload = {
        kabadiwalaId: numericKabadiwalaId,
        pickupAddress,
        scheduledDate,
        timeSlot,
        notes: specialInstructions,
        items: pickupItems.map((item) => ({
          categoryId: categoryIdMap[item.category] || 1,
          estimatedWeight: item.estimated_kg,
        })),
      };

      const res = await api.createPickup(payload);

      const bookingId = res.data?.bookingNumber || `KC-PK-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBookingId(bookingId);

      onConfirmBooking({
        pickup_id: bookingId,
        household_id: 'hh-01',
        household_name: customerName,
        household_phone: customerPhone,
        kabadiwala_id: kabadiwala.kabadiwala_id,
        kabadiwala_name: kabadiwala.business_name,
        kabadiwala_phone: kabadiwala.phone,
        kabadiwala_area: `${kabadiwala.area}, ${kabadiwala.city}`,
        warehouse_id: kabadiwala.warehouse_id,
        pickup_address: pickupAddress,
        area: userLocation.area,
        pin_code: userLocation.pin_code,
        scheduled_date: scheduledDate,
        time_slot: timeSlot,
        status: 'Requested',
        items: pickupItems,
        estimated_weight: totalEstimatedWeight,
        estimated_value: totalEstimatedValue,
        special_instructions: specialInstructions,
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Failed to create pickup in database:', err);
      setErrorMessage(err.message || 'Database error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#E0D5C3] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {isSuccess ? (
          /* Confirmation Success View (Section 11 Requirement) */
          <div className="p-8 text-center space-y-6 bg-[#FAF8F5]">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                Booking ID: {confirmedBookingId}
              </span>
              <h2 className="font-display font-black text-3xl text-slate-900 tracking-tight mt-2">
                Pickup Scheduled ✓
              </h2>
              <p className="text-xs text-slate-500">
                Your request has been dispatched to {kabadiwala.business_name} through our partner network.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E0D5C3] text-left text-xs space-y-3">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Kabadiwala:</span>
                <strong className="text-slate-900">{kabadiwala.business_name}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Pickup Slot:</span>
                <strong className="text-slate-900">{scheduledDate} ({timeSlot})</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Address:</span>
                <strong className="text-slate-900 max-w-[260px] truncate">{pickupAddress}</strong>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Estimated Scrap:</span>
                <strong className="text-slate-900">{totalEstimatedWeight} kg ({activeCategories.join(' + ')})</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 font-bold">Estimated Payout:</span>
                <strong className="font-mono font-black text-base text-[#240A39]">₹{totalEstimatedValue}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-left text-[11px] leading-relaxed">
              <span className="font-bold">Next Step:</span> The collector will review and accept your request shortly. You can track status in real-time from your Household Dashboard.
            </div>

            <button
              onClick={onClose}
              className="w-full h-12 rounded-xl bg-[#240A39] hover:bg-[#3B1458] text-amber-400 font-bold text-xs shadow-sm transition-colors"
            >
              Go to Household Dashboard
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleConfirm} className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#240A39] text-white p-5 shrink-0 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-amber-300 uppercase font-bold">
                  Step 4 of 4 — Schedule Doorstep Pickup
                </div>
                <h2 className="font-display font-black text-xl text-white">
                  {kabadiwala.business_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-purple-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-5 overflow-y-auto bg-[#FAF8F5] text-xs">
              {/* Category Weights & Live Dynamic Estimation Formula (Prompt Section 11) */}
              <div className="bg-white rounded-2xl p-4 border border-[#E0D5C3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider font-mono text-[11px]">
                    Estimate Your Scrap Quantity (kg)
                  </span>
                  <span className="text-slate-400 text-[11px]">Adjust kg to calculate</span>
                </div>

                <div className="space-y-3">
                  {pickupItems.map((item) => (
                    <div
                      key={item.category}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0D5C3] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{item.category}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Rate: ₹{item.rate_per_kg}/kg
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={quantities[item.category] || 1}
                            onChange={(e) =>
                              setQuantities({
                                ...quantities,
                                [item.category]: parseFloat(e.target.value) || 0
                              })
                            }
                            className="w-16 h-9 px-2 text-center rounded-lg bg-white border border-[#E0D5C3] font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-[#240A39]"
                          />
                          <span className="text-slate-500 font-mono">kg</span>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <span className="font-mono font-bold text-sm text-[#240A39]">
                            ₹{item.calculated_estimate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formula Breakdown & Total */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                  <div className="space-y-0.5">
                    <span className="text-amber-950 font-bold block">Estimated Total Payout:</span>
                    <span className="text-[11px] text-amber-800 font-mono">
                      {pickupItems.map((i) => `${i.estimated_kg}kg×₹${i.rate_per_kg}`).join(' + ')}
                    </span>
                  </div>
                  <div className="font-display font-black text-2xl text-[#240A39] tabular-nums">
                    ₹{totalEstimatedValue}
                  </div>
                </div>

                {/* Prompt Required Notice */}
                <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-950 text-[11px] leading-relaxed">
                  <span className="font-bold">Important Notice: </span>
                  "This is an estimated value. Final payment will be based on actual weight and applicable rate at the time of pickup."
                </div>
              </div>

              {/* Date & Time Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Pickup Date
                  </label>
                  <select
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  >
                    <option value="Today (Within 2 Hours)">Today (Within 2 Hours)</option>
                    <option value="Tomorrow, 25 Sep 2026">Tomorrow, 25 Sep 2026</option>
                    <option value="Saturday, 26 Sep 2026">Saturday, 26 Sep 2026</option>
                    <option value="Sunday, 27 Sep 2026">Sunday, 27 Sep 2026</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Time Window
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  >
                    <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                    <option value="12:00 PM – 02:00 PM">12:00 PM – 02:00 PM</option>
                    <option value="02:00 PM – 04:00 PM">02:00 PM – 04:00 PM</option>
                    <option value="04:00 PM – 06:00 PM">04:00 PM – 06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Customer Contact & Address */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mobile Number (for SMS & Verification)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Doorstep Pickup Address
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Call before coming, 3rd floor, gate code"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-[#E0D5C3] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#240A39]"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mx-6 mb-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Footer Submit Button */}
            <div className="p-4 bg-white border-t border-[#E0D5C3] shrink-0 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-4 rounded-xl border border-[#E0D5C3] text-slate-700 font-bold text-xs hover:bg-stone-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-[#240A39] font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-[#240A39]" />
                    <span>Booking to Cloud SQL...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Pickup (Est: ₹{totalEstimatedValue})</span>
                    <ArrowRight className="w-4 h-4 text-[#240A39]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
