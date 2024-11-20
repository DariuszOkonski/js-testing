import { describe, expect, it, test } from 'vitest';

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
  });
});
