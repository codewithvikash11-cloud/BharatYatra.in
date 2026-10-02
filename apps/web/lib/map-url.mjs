export function getMapPinUrl(latitude, longitude) {
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    return null;
  }

  const point = `${latitude},${longitude}`;
  const url = new URL('https://www.openstreetmap.org/');
  url.searchParams.set('mlat', String(latitude));
  url.searchParams.set('mlon', String(longitude));
  url.hash = `map=16/${point}`;
  return url.toString();
}
