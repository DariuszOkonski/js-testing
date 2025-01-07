import { beforeEach, describe, expect, it } from 'vitest';
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core';

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
    // const mockArray = [
    //   { code: 'SAVE20NOW', discount: 0.2 },
    //   { code: 'DISCOUNT50OFF', discount: 0.5 },
    // ];

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

describe('validateUserInput v1', () => {
  it('should return invalid username message if username is not a string', () => {
    const result = validateUserInput(10, 20);
    expect(result).toMatch(/invalid username/i);
  });
  it('should return invalid username message if username length less than 3', () => {
    const result = validateUserInput('ab', 20);
    expect(result).toMatch(/invalid username/i);
  });
  it('should return invalid age message if age not a number', () => {
    const result = validateUserInput('john', '20');
    expect(result).toMatch(/age/i);
  });
  it('should return invalid age message if age less than 18', () => {
    const result = validateUserInput('john', 17);
    expect(result).toMatch(/age/i);
  });
  it('should return invalid username and age if username not string and age not number', () => {
    const result = validateUserInput(10, '10');
    expect(result).toMatch(/invalid username/i);
    expect(result).toMatch(/invalid age/i);
  });
  it('should return invalid username and age if username length less than 3 and age less 18', () => {
    const result = validateUserInput('ab', 17);
    expect(result).toMatch(/invalid username/i);
    expect(result).toMatch(/invalid age/i);
  });

  it('should return valid message if number of errors equal 0', () => {
    const result = validateUserInput('john', 18);
    expect(result).toMatch(/successful/i);
  });
});

describe('validateUserInput v2', () => {
  it('should return success if given valid input', () => {
    expect(validateUserInput('mosh', 42)).toMatch(/success/i);
  });

  it('should return an error if username is not a string', () => {
    expect(validateUserInput(1, 42)).toMatch(/invalid/i);
  });

  it('should return an error if username is less than 3 characters', () => {
    expect(validateUserInput('mo', 42)).toMatch(/invalid/i);
  });

  it('should return an error if username is longer than 255 characters', () => {
    expect(validateUserInput('m'.repeat(256), 42)).toMatch(/invalid/i);
  });

  it('should return an error if age is not a number', () => {
    expect(validateUserInput('mosh', '42')).toMatch(/invalid/i);
  });

  it('should return an error if age is less than 18', () => {
    expect(validateUserInput('mosh', 17)).toMatch(/invalid/i);
  });

  it('should return an error if age is greater than 100', () => {
    expect(validateUserInput('mosh', 101)).toMatch(/invalid/i);
  });

  it('should return an error if both username and age are invalid', () => {
    expect(validateUserInput('', 0)).toMatch(/invalid username/i);
    expect(validateUserInput('', 0)).toMatch(/invalid age/i);
  });
});

describe('isPriceInRange v1', () => {
  it.each([
    { price: -10, min: 0, max: 100, result: false },
    { price: 200, min: 0, max: 100, result: false },
    { price: 0, min: 0, max: 100, result: true },
    { price: 100, min: 0, max: 100, result: true },
    { price: 10, min: 0, max: 100, result: true },
  ])(
    'should return $result when the price $price between (min: $min, max: $max)',
    ({ price, min, max, result }) => {
      expect(isPriceInRange(price, min, max)).toBe(result);
    },
  );

  // it('should return false when the price is outside the range', () => {
  //   expect(isPriceInRange(-10, 0, 100)).toBe(false);
  //   expect(isPriceInRange(200, 0, 100)).toBe(false);
  // });

  // it('should return true when the price is equal to the min or to the max', () => {
  //   expect(isPriceInRange(0, 0, 100)).toBe(true);
  //   expect(isPriceInRange(100, 0, 100)).toBe(true);
  // });

  // it('should return true when the price is within the range', () => {
  //   expect(isPriceInRange(10, 0, 100)).toBe(true);
  // });
});

describe('isPriceInRange v2', () => {
  it.each([
    { scenario: 'price < min', price: -10, result: false },
    { scenario: 'price = min', price: 0, result: true },
    { scenario: 'price between min and max', price: 50, result: true },
    { scenario: 'price > max', price: 200, result: false },
    { scenario: 'price = max', price: 100, result: true },
  ])('should return $result when $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe('isValidUsername v1', () => {
  it('should return true if username length between min and max', () => {
    expect(isValidUsername('maximilian')).toBe(true);
  });

  it('should return true if username length equal to min length', () => {
    expect(isValidUsername('darek')).toBe(true);
  });

  it('should return true if username length equal to max length', () => {
    expect(isValidUsername('darekDarekDarek')).toBe(true);
  });

  it('should return false if username less than min length', () => {
    expect(isValidUsername('daro')).toBe(false);
  });

  it('should return false if username more than max length', () => {
    expect(isValidUsername('darekDarekDarekD')).toBe(false);
  });
});

describe('isValidUsername v2', () => {
  const minLength = 5;
  const maxLength = 15;

  it('should return false if username is too short', () => {
    expect(isValidUsername('a'.repeat(minLength - 1))).toBe(false);
  });

  it('should return false if username is too long', () => {
    expect(isValidUsername('a'.repeat(maxLength + 1))).toBe(false);
  });

  it('should return true if username is at the min or max length', () => {
    expect(isValidUsername('a'.repeat(minLength))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength))).toBe(true);
  });

  it('should return true if username is within the length constraint', () => {
    expect(isValidUsername('a'.repeat(minLength + 1))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength - 1))).toBe(true);
  });

  it('should return false for invalid input types', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe('canDrive v1', () => {
  it('should check if countryCode is valid', () => {
    expect(canDrive(16, 'PL')).toMatch(/invalid/i);
  });

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])(
    'should return $result for age $age in the $country',
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    },
  );
});

describe('canDrive v2', () => {
  it('should return error for invalid country code', () => {
    expect(canDrive(20, 'FR')).toMatch(/invalid/i);
  });

  it.each([
    { age: 15, country: 'US', result: false },
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 16, country: 'UK', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
  ])(
    'should return $result for ($age, $country)',
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    },
  );
});

describe('fetchData', () => {
  it('should return a promise that will resolve to an array of numbers', async () => {
    try {
      await fetchData();
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/failed/i);
    }

    // expect(Array.isArray(result)).toBe(true);
    // expect(result.length).toBeGreaterThan(0);

    // fetchData().then((result) => {
    //   expect(Array.isArray(result)).toBe(true);
    //   expect(result.length).toBeGreaterThan(0);
    // });
  });
});

describe('Stack v1', () => {
  it('should return one item', () => {
    const stack = new Stack();
    stack.push(1);
    expect(stack.size()).toEqual(1);
  });

  it('should pop one item from stack', () => {
    const stack = new Stack();

    expect(stack.size()).toEqual(0);
    stack.push(22);
    expect(stack.size()).toEqual(1);
    const poped = stack.pop();
    expect(stack.size()).toEqual(0);
    expect(poped).toBe(22);
  });

  it('should thrown error if empty array when pop', () => {
    const stack = new Stack();
    expect(() => stack.pop()).toThrowError(/stack is empty/i);
  });

  it('should peek top item', () => {
    const stack = new Stack();

    expect(stack.size()).toEqual(0);
    stack.push(22);
    expect(stack.size()).toEqual(1);
    const peeked = stack.peek();
    expect(stack.size()).toEqual(1);
    expect(peeked).toBe(22);
  });

  it('should thrown error if empty array when peek', () => {
    const stack = new Stack();
    expect(() => stack.peek()).toThrowError(/stack is empty/i);
  });

  it('should check if empty', () => {
    const stack = new Stack();
    expect(stack.isEmpty()).toBe(true);
  });

  it('should return size', () => {
    const stack = new Stack();
    expect(stack.size()).toEqual(0);
  });

  it('should clear array', () => {
    const stack = new Stack();

    stack.push(1);
    stack.push(2);
    expect(stack.size()).toEqual(2);
    stack.clear();
    expect(stack.size()).toEqual(0);
  });
});

describe('Stack v2', () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });

  it('push should add an item to the stack', () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it('pop should remove and return the top item from the stack', () => {
    stack.push(1);
    stack.push(2);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it('pop should throw an error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('peek should return the top item from the stack without removing it', () => {
    stack.push(1);
    stack.push(2);

    const peeked = stack.peek();

    expect(peeked).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('peek should throw an error if stack is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it('isEmpty should return true if stack is empty', () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it('isEmpty should return false if stack is not empty', () => {
    stack.push(1);
    expect(stack.isEmpty()).toBe(false);
  });

  it('size should return the number of items in the stack', () => {
    stack.push(1);
    stack.push(2);

    expect(stack.size()).toBe(2);
  });

  it('clear should remove all items from the stack', () => {
    stack.push(1);
    stack.push(2);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});
