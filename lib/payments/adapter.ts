export interface PaymentMetadata {
  userId: string;
  type: 'subscription' | 'credits';
  plan?: string;
  credits?: number;
  [key: string]: any;
}

export interface InitializePaymentParams {
  email: string;
  amount: number; // in smallest currency unit (kobo, cents)
  metadata: PaymentMetadata;
  currency?: string;
}

export interface InitializePaymentResult {
  authorizationUrl: string;
  reference: string;
  provider: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  reference: string;
  amount: number;
  metadata: PaymentMetadata;
  provider: string;
}

export interface ValidateWebhookResult {
  valid: boolean;
  event: string;
  data: any;
}

export interface PaymentAdapter {
  name: string;
  initialize(params: InitializePaymentParams): Promise<InitializePaymentResult>;
  verify(reference: string): Promise<VerifyPaymentResult>;
  validateWebhook(body: string, signature: string): ValidateWebhookResult;
}