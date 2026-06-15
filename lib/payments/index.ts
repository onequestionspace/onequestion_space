import { PaystackAdapter } from './paystack';
import { StripeAdapter } from './stripe';
import type { PaymentAdapter } from './adapter';

// Change this one line to swap payment providers
export const paymentProvider: PaymentAdapter = PaystackAdapter;

export type { PaymentAdapter, PaymentMetadata, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult, ValidateWebhookResult } from './adapter';