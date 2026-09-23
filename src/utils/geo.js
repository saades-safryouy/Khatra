/**
 * Haversine formula to calculate the distance between two points in km
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const numLat1 = Number(lat1);
  const numLon1 = Number(lon1);
  const numLat2 = Number(lat2);
  const numLon2 = Number(lon2);
  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((numLat2 - numLat1) * Math.PI) / 180;
  const dLon = ((numLon2 - numLon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((numLat1 * Math.PI) / 180) *
      Math.cos((numLat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance cleanly: "850 m" if < 1km, otherwise "2.4 km"
 */
export function formatDistance(distanceKm, lang = 'fr') {
  if (distanceKm == null || isNaN(distanceKm)) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return lang === 'ar' ? `${meters} م` : `${meters} m`;
  }
  const km = distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm);
  return lang === 'ar' ? `${km} كم` : `${km} km`;
}

/**
 * Sort stores by nearest distance to user coordinates
 */
export function sortStoresByDistance(stores, userLat, userLng) {
  if (!Array.isArray(stores)) return [];
  if (userLat == null || userLng == null) return stores;

  const withDist = stores.map((s) => {
    const dist = calculateDistanceKm(userLat, userLng, s.latitude, s.longitude);
    return { ...s, distanceKm: dist };
  });

  return withDist.sort((a, b) => {
    if (a.distanceKm == null && b.distanceKm == null) return 0;
    if (a.distanceKm == null) return 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });
}
