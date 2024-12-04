import { vi, it, expect, describe } from 'vitest';
import { getPriceInCurrency, getShippingInfo } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');

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

  it('test suite v1', () => {
    const sendText = vi.fn();

    sendText.mockImplementation((message) => 'ok');

    const result = sendText('Message');

    expect(sendText).toHaveBeenCalled();
    expect(sendText).toHaveBeenCalledWith('Message');
    expect(result).toBe('ok');
  });

  it('test suite v2', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');

    const result = sendText('message');

    expect(sendText).toHaveBeenCalledWith('message');
    expect(result).toBe('ok');
  });
});

describe('getPriceInCurrency', () => {
  it('should return in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, 'AUD');

    expect(price).toBe(15);
  });
});

describe('getShippingInfo v1', () => {
  it('should return undefine quote', () => {
    vi.mocked(getShippingQuote).mockReturnValue(undefined);

    const result = getShippingInfo('USA');
    expect(result).toMatch(/unavailable/i);
  });

  it('should return quote with estimation', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 5 });

    const result = getShippingInfo('USA');
    expect(result).toMatch(`$10 (5 Days)`);
  });
});

describe('getShippingInfo v2', () => {
  it('should return shipping unavailable if quote cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo('London');

    expect(result).toMatch(/unavailable/i);
  });

  it('should return shipping info if quote can be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });

    const result = getShippingInfo('London');

    expect(result).toMatch('$10');
    expect(result).toMatch(/2 days/i);
    expect(result).toMatch(/shipping cost: \$10 \(2 days\)/i);
  });
});
