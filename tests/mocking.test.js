import { vi, it, expect, describe } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';

vi.mock('../src/libs/currency.js');
vi.mock('../src/libs/shipping.js');
vi.mock('../src/libs/analytics.js');

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

describe('renderPage v1', () => {
  it('should return correct content', async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledOnce();
    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('renderPage v2', () => {
  it('should check if trackPageView have been called', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledOnce();
    expect(trackPageView).toHaveBeenCalledWith('/home');
  });

  it('should check if return value is proper', async () => {
    const result = await renderPage();

    console.log(result);
    expect(result).toMatch(/content/i);
  });
});
