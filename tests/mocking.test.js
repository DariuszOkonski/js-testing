import { vi, it, expect, describe, beforeEach } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency.js');
vi.mock('../src/libs/shipping.js');
vi.mock('../src/libs/analytics.js');
vi.mock('../src/libs/payment.js');
vi.mock('../src/libs/email.js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

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

    expect(result).toMatch(/content/i);
  });
});

describe('submitOrder', () => {
  const creditCardInfo = {
    creditCardNumber: '10',
  };

  const order = {
    totalAmount: '20',
  };

  it('should return error object if paymentResult status failed', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });
    const result = await submitOrder(order, creditCardInfo);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });

  it('should return success object if paymentResult status success', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    const result = await submitOrder(order, creditCardInfo);

    expect(result).toEqual({ success: true });
  });

  it('should check if charge method has been called', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    await submitOrder(order, creditCardInfo);

    expect(charge).toHaveBeenCalledOnce();
    expect(charge).toHaveBeenCalledWith({ creditCardNumber: '10' }, '20');
  });
});

describe('submitOrder V2', () => {
  const order = { totalAmount: '10' };
  const creditCard = { creditCardNumber: '11' };

  it.skip('should return failed when payment is failed', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed ' });
    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: 'payment_error' });
  });

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ success: 'success' });
    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return success when payment is successful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: true });
  });
});

describe('signUp V1', () => {
  beforeEach(() => {
    // vi.mocked(sendEmail).mockClear();
    vi.clearAllMocks();
  });

  const email = 'name@domain.com';
  it('should return false if email is not valid', async () => {
    const result = await signUp('a');
    expect(result).toBe(false);
  });

  it('should return true if email is valid', async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });

  it('should send the welcome email if email is valid', async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    expect(sendEmail).toHaveBeenCalledWith(email, 'Welcome aboard!');

    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe('login', () => {
  it('should email the one-time login code', async () => {
    const email = 'name@domain.com';
    const spy = vi.spyOn(security, 'generateCode');

    await login(email);
    const securityCode = spy.mock.results[0].value.toString();

    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if current hour is outside opening hours', () => {
    vi.setSystemTime('2024-01-01 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-01-01 20:00');
    expect(isOnline()).toBe(false);
  });

  it('should return true if current hour is within opening hours', () => {
    vi.setSystemTime('2024-01-01 08:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-01-01 19:59');
    expect(isOnline()).toBe(true);
  });
});
