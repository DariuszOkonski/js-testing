import { vi, it, expect, describe } from 'vitest';
import { getPriceInCurrency, getShippingInfo } from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';

vi.mock('../src/libs/currency.js');
vi.mock('../src/libs/shipping.js');

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

describe('getShippingInfo v1', () => {
  it('should return message if no quote', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const quote = getShippingInfo('USA');
    expect(quote).toContain('Unavailable');
  });

  it('should return message with cost and days if there is quote', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });
    const quote = getShippingInfo('USA');

    expect(quote).toContain('$10');
    expect(quote).toContain('2 Days');
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
