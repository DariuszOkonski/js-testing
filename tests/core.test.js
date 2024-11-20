import { describe, expect, it, test } from 'vitest';
import { getCoupons } from '../src/core';

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
