import type { PaymentAdapter, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult, ValidateWebhookResult } from './adapter';

// TODO: npm install stripe then implement
export const StripeAdapter: PaymentAdapter = {
  name: 'stripe',

  async initialize(params): Promise<InitializePaymentResult> {
    throw new Error('Stripe adapter not implemented yet');
  },

  async verify(reference): Promise<VerifyPaymentResult> {
    throw new Error('Stripe adapter not implemented yet');
  },

  validateWebhook(body, signature): ValidateWebhookResult {
    throw new Error('Stripe adapter not implemented yet');
  },
};