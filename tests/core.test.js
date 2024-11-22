import { describe, expect, it, test } from 'vitest';
import { calculateDiscount, getCoupons } from '../src/core';

describe('core test cases', () => {
  it('test case 1', () => {
    const result = { name: 'Mosh' };
    expect(result).toEqual({ name: 'Mosh' });
  });

  it('test case 2', () => {
    const result = 'The requested file was not found';
    expect(result).toBeDefined();
    expect(result).toBe('The requested file was not found');
    expect(result).toMatch(/not found/i);
  });

  it('test case 3', () => {
    const result = [2, 1, 3];
    expect(result).toBeDefined();
    expect(result).toEqual(expect.arrayContaining([1, 2, 3]));
    expect(result).toHaveLength(3);
    expect(result.length).toBeGreaterThan(0);
  });

  it('test case 4', () => {
    const result = { name: 'Mosh', id: 1 };
    // expect(result).toEqual({ name: 'Mosh' });
    expect(result).toMatchObject({ name: 'Mosh' });
    expect(result).toHaveProperty('name');
    expect(typeof result.name).toBe('string');
    expect(result).toHaveProperty('id');
    expect(typeof result.id).toBe('number');
  });
});

describe('getCoupons v1', () => {
  it('should not return an empty array', () => {
    const result = getCoupons();
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBe(2);
  });

  it('should return array with two objects', () => {
    const mockArray = [
      { code: 'SAVE20NOW', discount: 0.2 },
      { code: 'DISCOUNT50OFF', discount: 0.5 },
    ];

    const result = getCoupons();

    expect(result[0]).toHaveProperty('code');
    expect(result[0]).toHaveProperty('discount');
    expect(typeof result[0].code).toBe('string');
    expect(typeof result[0].discount).toBe('number');

    expect(result[1]).toHaveProperty('code');
    expect(result[1]).toHaveProperty('discount');
    expect(typeof result[1].code).toBe('string');
    expect(typeof result[1].discount).toBe('number');
  });
});

describe('getCoupons v2', () => {
  it('should return an array of coupons', () => {
    const coupons = getCoupons();

    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  it('should return an array with valid coupon codes', () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(typeof coupon.code).toBe('string');
      expect(coupon.code).toBeTruthy();
    });
  });

  it('should return an array with valid discounts', () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe('calculateDiscount', () => {
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9);
    expect(calculateDiscount(10, 'SAVE20')).toBe(8);
  });

  it('should handle non-numeric price', () => {
    const result = calculateDiscount('10', 'SAVE10');
    expect(result).toMatch(/invalid/i);
  });

  it('should handle negative price', () => {
    const result = calculateDiscount(-10, 'SAVED10');
    expect(result).toMatch(/invalid/i);
  });

  it('should handle non-string discount code', () => {
    const result = calculateDiscount(10, 10);
    expect(result).toMatch(/discount/i);
  });

  it('should handle invalid discount code', () => {
    const result = calculateDiscount(10, 'INVALID');
    expect(result).toBe(10);
  });
});
