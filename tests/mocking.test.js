import { vi, it, expect, describe } from 'vitest';
import { getPriceInCurrency } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';

vi.mock('../src/libs/currency.js');

describe('test suite', () => {
  it('test case', async () => {
    const greet = vi.fn();

    // greet.mockReturnValue('Hello');
    // greet.mockResolvedValue('Hello');
    greet.mockImplementation((name) => 'Hello ' + name);

    const result = await greet('Mosh');

    // expect(result).toBe('Hello Mosh');
    expect(greet).toHaveBeenCalled();
    expect(greet).toHaveBeenCalledWith('Mosh');
  });

  it('test case for sendText(message) v1', async () => {
    const sendText = vi.fn();
    sendText.mockImplementation((message) => 'ok');

    const result = sendText('myMessage');

    expect(sendText).toHaveBeenCalled();
    expect(sendText).toHaveBeenCalledWith('myMessage');
    expect(result).toBe('ok');
  });

  it('test case for sendText(message) v2', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');

    const result = sendText('message');

    expect(sendText).toHaveBeenCalled();
    expect(sendText).toHaveBeenCalledWith('message');
    expect(result).toBe('ok');
  });
});

describe('getPriceInCurrency v1', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, 'ASD');

    expect(price).toBe(15);
  });
});
