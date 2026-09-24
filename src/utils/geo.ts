/**
 * Geographic utility functions for Haversine distance calculation and service radius matching.
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates Great-Circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  // Return rounded to 1 decimal place
  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Checks if a household is within the Kabadiwala's service radius.
 * If distance <= serviceRadius, returns true.
 */
export function isWithinServiceRadius(
  householdLat: number,
  householdLon: number,
  kabadiwalaLat: number,
  kabadiwalaLon: number,
  serviceRadiusKm: number
): { isWithin: boolean; distanceKm: number } {
  const distanceKm = calculateDistanceKm(
    householdLat,
    householdLon,
    kabadiwalaLat,
    kabadiwalaLon
  );
  return {
    isWithin: distanceKm <= serviceRadiusKm,
    distanceKm,
  };
}

/**
 * Common preset locations for testing manual location input or quick demo selection.
 */
export interface PresetLocation {
  id: string;
  name: string;
  area: string;
  city: string;
  pin_code: string;
  latitude: number;
  longitude: number;
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    id: 'asansol-burnpur',
    name: 'Burnpur Road / Chitra',
    area: 'Burnpur Road',
    city: 'Asansol',
    pin_code: '713325',
    latitude: 23.6841,
    longitude: 86.9734,
  },
  {
    id: 'asansol-hutton',
    name: 'Hutton Road / SB Gorai',
    area: 'Hutton Road',
    city: 'Asansol',
    pin_code: '713301',
    latitude: 23.6889,
    longitude: 86.9852,
  },
  {
    id: 'gurugram-sec14',
    name: 'Sector 14 Residential Hub',
    area: 'Sector 14',
    city: 'Gurugram',
    pin_code: '122001',
    latitude: 28.4732,
    longitude: 77.0428,
  },
  {
    id: 'gurugram-sec56',
    name: 'Sector 56 Golf Course Ext',
    area: 'Sector 56',
    city: 'Gurugram',
    pin_code: '122011',
    latitude: 28.4239,
    longitude: 77.0984,
  },
  {
    id: 'bengaluru-indiranagar',
    name: 'Indiranagar 100 Feet Rd',
    area: 'Indiranagar',
    city: 'Bengaluru',
    pin_code: '560038',
    latitude: 12.9784,
    longitude: 77.6408,
  },
];
