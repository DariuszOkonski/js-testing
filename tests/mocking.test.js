import { vi, it, expect, describe } from 'vitest';

describe('test suite', () => {
  it('test case', () => {
    const greet = vi.fn();

    // greet.mockReturnValue('Hello');
    // greet.mockResolvedValue('Hello');
    greet.mockImplementation((name) => 'Hello ' + name);

    const result = greet('Mosh');

    expect(greet).toHaveBeenCalledOnce();
    expect(greet).toHaveBeenCalledWith('Mosh');
    expect(result).toMatch(/hello mosh/i);
  });

  it('sendText', () => {
    const sendText = vi.fn();
    sendText.mockImplementation((message) => 'ok ' + message);

    const result = sendText('foo');

    expect(sendText).toHaveBeenCalledOnce();
    expect(sendText).toHaveBeenCalledWith('foo');
    expect(result).toMatch(/ok/i);
  });
});
