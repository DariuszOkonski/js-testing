import { vi, it, expect, describe } from 'vitest';
import { getPriceInCurrency, getShippingInfo } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';

vi.mock('../src/libs/currency.js');
vi.mock('../src/libs/shipping.js');

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

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, 'AUD');

    expect(price).toBe(15);
    expect(getExchangeRate).toHaveBeenCalledOnce();
  });
});

describe('getShippingInfo V1', () => {
  it('should return shipping unavailable if no quote', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('UK');

    expect(getShippingQuote).toHaveBeenCalledOnce();
    expect(result).toMatch(/shipping unavailable/i);
  });

  it('should return shipping cost if quote is returned', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });
    const result = getShippingInfo('UK');

    expect(getShippingQuote).toHaveBeenCalledOnce();
    expect(result).toMatch(/shipping cost/i);
    expect(result).toMatch(/10/i);
    expect(result).toMatch(/2 days/i);
  });
});

describe('getShippingInfo V2', () => {
  it('should return shipping unavailable if quote cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('London');

    expect(result).toMatch(/shipping unavailable/i);
  });

  it('should return shipping info if quote can be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 15, estimatedDays: 2 });
    const result = getShippingInfo('London');

    expect(result).toMatch(/shipping cost/i);
    expect(result).toMatch('$15');
    expect(result).toMatch(/2 days/i);
  });
});
