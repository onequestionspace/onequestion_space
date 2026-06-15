import crypto from 'crypto';
import type { PaymentAdapter, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult, ValidateWebhookResult } from './adapter';

const BASE = 'https://api.paystack.co';
const SECRET = process.env.PAYSTACK_SECRET_KEY!;

export const PaystackAdapter: PaymentAdapter = {
  name: 'paystack',

  async initialize({ email, amount, metadata, currency = 'NGN' }): Promise<InitializePaymentResult> {
    const res = await fetch(BASE + '/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + SECRET, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount, metadata, currency }),
    });
    const data = await res.json();
    if (!data.status) throw new Error(data.message || 'Paystack init failed');
    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      provider: 'paystack',
    };
  },

  async verify(reference): Promise<VerifyPaymentResult> {
    const res = await fetch(BASE + '/transaction/verify/' + reference, {
      headers: { Authorization: 'Bearer ' + SECRET },
    });
    const data = await res.json();
    const tx = data.data;
    return {
      success: tx?.status === 'success',
      reference: tx?.reference || reference,
      amount: tx?.amount || 0,
      metadata: tx?.metadata || {},
      provider: 'paystack',
    };
  },

  validateWebhook(body, signature): ValidateWebhookResult {
    try {
      const hash = crypto.createHmac('sha512', SECRET).update(body).digest('hex');
      if (hash !== signature) return { valid: false, event: '', data: null };
      const parsed = JSON.parse(body);
      return { valid: true, event: parsed.event, data: parsed.data };
    } catch {
      return { valid: false, event: '', data: null };
    }
  },
};