import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('UNSUPPORTED');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError('PERMISSION_DENIED');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('POSITION_UNAVAILABLE');
        } else if (err.code === err.TIMEOUT) {
          setError('TIMEOUT');
        } else {
          setError('ERROR');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const clear = useCallback(() => {
    setCoords(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    coords,
    loading,
    error,
    locate,
    clear,
  };
}

export default useGeolocation;
