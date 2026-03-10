// City coordinates for travel distance calculation
// Uses a lookup table of major cities with latitude/longitude

const CITY_COORDINATES: Record<string, { lat: number; lng: number; country: string }> = {
  // India
  "delhi": { lat: 28.6139, lng: 77.2090, country: "India" },
  "new delhi": { lat: 28.6139, lng: 77.2090, country: "India" },
  "mumbai": { lat: 19.0760, lng: 72.8777, country: "India" },
  "bangalore": { lat: 12.9716, lng: 77.5946, country: "India" },
  "bengaluru": { lat: 12.9716, lng: 77.5946, country: "India" },
  "chennai": { lat: 13.0827, lng: 80.2707, country: "India" },
  "kolkata": { lat: 22.5726, lng: 88.3639, country: "India" },
  "hyderabad": { lat: 17.3850, lng: 78.4867, country: "India" },
  "pune": { lat: 18.5204, lng: 73.8567, country: "India" },
  "ahmedabad": { lat: 23.0225, lng: 72.5714, country: "India" },
  "jaipur": { lat: 26.9124, lng: 75.7873, country: "India" },
  "lucknow": { lat: 26.8467, lng: 80.9462, country: "India" },
  "chandigarh": { lat: 30.7333, lng: 76.7794, country: "India" },
  "kochi": { lat: 9.9312, lng: 76.2673, country: "India" },
  "kerala": { lat: 10.8505, lng: 76.2711, country: "India" },
  "goa": { lat: 15.2993, lng: 74.1240, country: "India" },
  "varanasi": { lat: 25.3176, lng: 82.9739, country: "India" },
  "indore": { lat: 22.7196, lng: 75.8577, country: "India" },
  "bhopal": { lat: 23.2599, lng: 77.4126, country: "India" },
  "nagpur": { lat: 21.1458, lng: 79.0882, country: "India" },
  "surat": { lat: 21.1702, lng: 72.8311, country: "India" },
  "patna": { lat: 25.6093, lng: 85.1376, country: "India" },
  "coimbatore": { lat: 11.0168, lng: 76.9558, country: "India" },
  "thiruvananthapuram": { lat: 8.5241, lng: 76.9366, country: "India" },

  // International - Americas
  "new york": { lat: 40.7128, lng: -74.0060, country: "USA" },
  "los angeles": { lat: 34.0522, lng: -118.2437, country: "USA" },
  "san francisco": { lat: 37.7749, lng: -122.4194, country: "USA" },
  "chicago": { lat: 41.8781, lng: -87.6298, country: "USA" },
  "toronto": { lat: 43.6532, lng: -79.3832, country: "Canada" },
  "vancouver": { lat: 49.2827, lng: -123.1207, country: "Canada" },
  "sao paulo": { lat: -23.5505, lng: -46.6333, country: "Brazil" },
  "mexico city": { lat: 19.4326, lng: -99.1332, country: "Mexico" },

  // International - Europe
  "london": { lat: 51.5074, lng: -0.1278, country: "UK" },
  "paris": { lat: 48.8566, lng: 2.3522, country: "France" },
  "berlin": { lat: 52.5200, lng: 13.4050, country: "Germany" },
  "rome": { lat: 41.9028, lng: 12.4964, country: "Italy" },
  "madrid": { lat: 40.4168, lng: -3.7038, country: "Spain" },
  "amsterdam": { lat: 52.3676, lng: 4.9041, country: "Netherlands" },
  "vienna": { lat: 48.2082, lng: 16.3738, country: "Austria" },
  "zurich": { lat: 47.3769, lng: 8.5417, country: "Switzerland" },
  "stockholm": { lat: 59.3293, lng: 18.0686, country: "Sweden" },
  "moscow": { lat: 55.7558, lng: 37.6173, country: "Russia" },

  // International - Asia & Oceania
  "tokyo": { lat: 35.6762, lng: 139.6503, country: "Japan" },
  "seoul": { lat: 37.5665, lng: 126.9780, country: "South Korea" },
  "beijing": { lat: 39.9042, lng: 116.4074, country: "China" },
  "shanghai": { lat: 31.2304, lng: 121.4737, country: "China" },
  "singapore": { lat: 1.3521, lng: 103.8198, country: "Singapore" },
  "dubai": { lat: 25.2048, lng: 55.2708, country: "UAE" },
  "sydney": { lat: -33.8688, lng: 151.2093, country: "Australia" },
  "melbourne": { lat: -37.8136, lng: 144.9631, country: "Australia" },
  "bangkok": { lat: 13.7563, lng: 100.5018, country: "Thailand" },
  "kuala lumpur": { lat: 3.1390, lng: 101.6869, country: "Malaysia" },
  "hong kong": { lat: 22.3193, lng: 114.1694, country: "China" },
  "taipei": { lat: 25.0330, lng: 121.5654, country: "Taiwan" },
  "jakarta": { lat: -6.2088, lng: 106.8456, country: "Indonesia" },

  // International - Africa & Middle East
  "cairo": { lat: 30.0444, lng: 31.2357, country: "Egypt" },
  "cape town": { lat: -33.9249, lng: 18.4241, country: "South Africa" },
  "nairobi": { lat: -1.2921, lng: 36.8219, country: "Kenya" },
  "istanbul": { lat: 41.0082, lng: 28.9784, country: "Turkey" },
  "tel aviv": { lat: 32.0853, lng: 34.7818, country: "Israel" },
};

/**
 * Calculate distance between two points using the Haversine formula
 * Returns distance in kilometers
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Look up city coordinates. Falls back to approximate center if city not found.
 */
function getCityCoords(city: string): { lat: number; lng: number; country: string } {
  const normalized = city.toLowerCase().trim();
  if (CITY_COORDINATES[normalized]) {
    return CITY_COORDINATES[normalized];
  }
  // Fallback: generate pseudo-random but deterministic coords based on city name
  // This ensures unknown cities still get a consistent location
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
    hash |= 0;
  }
  return {
    lat: (Math.abs(hash % 1800) - 900) / 10, // -90 to 90
    lng: (Math.abs((hash * 31) % 3600) - 1800) / 10, // -180 to 180
    country: "Unknown",
  };
}

/**
 * Calculate delivery delay in milliseconds, based on distance between two cities.
 *
 * Delay rules (from PRD):
 * - Same city (< 50km):          30 minutes
 * - Same country (< 2000km):     6–12 hours
 * - International (2000-8000km): 1–2 days
 * - Far international (>8000km): 2–3 days
 *
 * We apply a small random jitter to make it feel organic.
 */
export function calculateDeliveryDelay(senderCity: string, receiverCity: string): number {
  const from = getCityCoords(senderCity);
  const to = getCityCoords(receiverCity);
  const distanceKm = haversineDistance(from.lat, from.lng, to.lat, to.lng);

  let delayMs: number;

  if (distanceKm < 50) {
    // Same city: 30 minutes
    delayMs = 30 * 60 * 1000;
  } else if (distanceKm < 500) {
    // Nearby: 2–4 hours
    delayMs = (2 + Math.random() * 2) * 60 * 60 * 1000;
  } else if (distanceKm < 2000) {
    // Same country range: 6–12 hours
    delayMs = (6 + Math.random() * 6) * 60 * 60 * 1000;
  } else if (distanceKm < 8000) {
    // International: 1–2 days
    delayMs = (24 + Math.random() * 24) * 60 * 60 * 1000;
  } else {
    // Far international: 2–3 days
    delayMs = (48 + Math.random() * 24) * 60 * 60 * 1000;
  }

  return Math.round(delayMs);
}

/**
 * Calculate the delivery ETA date from now
 */
export function calculateDeliveryEta(senderCity: string, receiverCity: string): Date {
  const delayMs = calculateDeliveryDelay(senderCity, receiverCity);
  return new Date(Date.now() + delayMs);
}

/**
 * Format a remaining time in a human-readable way (e.g., "4h 12m" or "1d 6h")
 */
export function formatTimeRemaining(etaDate: Date): string {
  const now = Date.now();
  const eta = etaDate.getTime();
  const remaining = eta - now;

  if (remaining <= 0) return "Arrived";

  const totalMinutes = Math.floor(remaining / (60 * 1000));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
