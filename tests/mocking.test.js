import { vi, it, expect, describe } from 'vitest';

describe('test suite', () => {
  it('test case', () => {
    const greet = vi.fn();

    // mockReturnValue
    // mockResolvedValue
    // mockImplementation

    // greet.mockReturnValue('hello');
    // greet.mockResolvedValue('Hello');
    greet.mockImplementation((name) => 'Hello ' + name);

    const result = greet('Mosh');

    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith('Mosh');
    expect(greet).toHaveBeenCalledOnce();
  });
});
