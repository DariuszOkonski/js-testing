import { describe, test, expect, it } from 'vitest';
import { fizzBuzz, max, calculateAverage, factorialV1 } from '../src/intro';

describe('max', () => {
  test('should return the first argument if it is greater', () => {
    expect(max(2, 1)).toBe(2);
  });

  test('should return the second argument if it is greater', () => {
    expect(max(1, 2)).toBe(2);
  });

  test('should return the first argument if arguments are equal', () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe('fizzBuzz', () => {
  it('should return FizzBuzz if arg is divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });

  it('should return Fizz if arg is divisible by 3', () => {
    expect(fizzBuzz(6)).toBe('Fizz');
  });

  it('should return Buzz if arg is divisible by 5', () => {
    expect(fizzBuzz(10)).toBe('Buzz');
  });

  it('should return argument as string if not divisible by 3 or 5', () => {
    expect(fizzBuzz(7)).toBe('7');
  });
});

describe('calculateAverage', () => {
  it('should return NaN if given an empty array', () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it('should calculate the average of an array with a single element', () => {
    expect(calculateAverage([2])).toBe(2);
  });

  it('should calculate the average of an array with two elements', () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it('should calculate the average of an array with three elements', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe('factorial v1', () => {
  it('should return 1 if factorial is equal 0', () => {
    expect(factorialV1(0)).toBe(1);
  });

  it('should return 1 if factorial is equal 1', () => {
    expect(factorialV1(1)).toBe(1);
  });

  it('should return 2 if factorial is equal 2', () => {
    expect(factorialV1(2)).toBe(2);
  });

  it('should return 6 if factorial is equal 3', () => {
    expect(factorialV1(3)).toBe(6);
  });
});
