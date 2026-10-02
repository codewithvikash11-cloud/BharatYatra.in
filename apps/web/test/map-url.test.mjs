import test from 'node:test';
import assert from 'node:assert/strict';
import { getMapPinUrl } from '../lib/map-url.mjs';

test('builds a map pin link for finite coordinates within valid geographic ranges', () => {
  const url = new URL(getMapPinUrl(28.6139, 77.209));
  assert.equal(url.origin, 'https://www.openstreetmap.org');
  assert.equal(url.searchParams.get('mlat'), '28.6139');
  assert.equal(url.searchParams.get('mlon'), '77.209');
  assert.equal(url.hash, '#map=16/28.6139,77.209');
});

test('does not create a map pin when coordinates are missing, malformed, or outside geographic ranges', () => {
  assert.equal(getMapPinUrl(null, 77), null);
  assert.equal(getMapPinUrl('28.6', 77), null);
  assert.equal(getMapPinUrl(Number.NaN, 77), null);
  assert.equal(getMapPinUrl(91, 77), null);
  assert.equal(getMapPinUrl(28, 181), null);
});
