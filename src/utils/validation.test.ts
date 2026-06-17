import { describe, expect, it } from 'vitest';

import {
  getBookingDateRange,
  normalizePhoneForStorage,
  validateDate,
  validateGuests,
  validateName,
  validatePhone,
  validateTime,
} from './validation';

describe('validateName', () => {
  it('accepts Cyrillic letters, spaces and hyphens', () => {
    expect(validateName('Анна-Мария')).toBeNull();
  });

  it('rejects digits and too-short values', () => {
    expect(validateName('А')).not.toBeNull();
    expect(validateName('Анна2')).not.toBeNull();
  });
});

describe('validatePhone', () => {
  it('accepts formatted Russian phone numbers', () => {
    expect(validatePhone('+7 (999) 123-45-67')).toBeNull();
    expect(validatePhone('8-999-123-45-67')).toBeNull();
  });

  it('rejects an invalid prefix or digit count', () => {
    expect(validatePhone('+1 999 123 45 67')).not.toBeNull();
    expect(validatePhone('+7 999 123 45')).not.toBeNull();
  });

  it('normalizes a phone number before storage', () => {
    expect(normalizePhoneForStorage('8 (999) 123-45-67')).toBe('+79991234567');
  });
});

describe('validateDate', () => {
  const now = new Date(2025, 5, 15, 14, 30);

  it('accepts today and the 90th day', () => {
    expect(validateDate('2025-06-15', now)).toBeNull();
    expect(validateDate('2025-09-13', now)).toBeNull();
  });

  it('rejects past dates and dates after the 90-day range', () => {
    expect(validateDate('2025-06-14', now)).not.toBeNull();
    expect(validateDate('2025-09-14', now)).not.toBeNull();
  });

  it('returns a local-date-safe min and max range', () => {
    expect(getBookingDateRange(now)).toEqual({
      min: '2025-06-15',
      max: '2025-09-13',
    });
  });
});

describe('time and guests validation', () => {
  it('only accepts available hourly slots', () => {
    expect(validateTime('12:00')).toBeNull();
    expect(validateTime('22:00')).toBeNull();
    expect(validateTime('12:30')).not.toBeNull();
  });

  it('only accepts integer guest counts from 1 to 12', () => {
    expect(validateGuests(1)).toBeNull();
    expect(validateGuests(12)).toBeNull();
    expect(validateGuests(0)).not.toBeNull();
    expect(validateGuests(2.5)).not.toBeNull();
  });
});
