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

  it('sendText V1', () => {
    const sendText = vi.fn();
    sendText.mockImplementation((message) => 'ok ' + message);

    const result = sendText('foo');

    expect(sendText).toHaveBeenCalledOnce();
    expect(sendText).toHaveBeenCalledWith('foo');
    expect(result).toMatch(/ok/i);
  });

  it('sendText V2', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');

    const result = sendText('message');

    expect(sendText).toHaveBeenCalledWith('message');
    expect(result).toBe('ok');
  });
});
