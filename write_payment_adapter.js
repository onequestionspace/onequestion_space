const fs = require('fs');

// Create the adapter interface and implementations
fs.mkdirSync('lib/payments', { recursive: true });

// 1. Base adapter interface
const adapterInterface = [
  "export interface PaymentMetadata {",
  "  userId: string;",
  "  type: 'subscription' | 'credits';",
  "  plan?: string;",
  "  credits?: number;",
  "  [key: string]: any;",
  "}",
  "",
  "export interface InitializePaymentParams {",
  "  email: string;",
  "  amount: number; // in smallest currency unit (kobo, cents)",
  "  metadata: PaymentMetadata;",
  "  currency?: string;",
  "}",
  "",
  "export interface InitializePaymentResult {",
  "  authorizationUrl: string;",
  "  reference: string;",
  "  provider: string;",
  "}",
  "",
  "export interface VerifyPaymentResult {",
  "  success: boolean;",
  "  reference: string;",
  "  amount: number;",
  "  metadata: PaymentMetadata;",
  "  provider: string;",
  "}",
  "",
  "export interface ValidateWebhookResult {",
  "  valid: boolean;",
  "  event: string;",
  "  data: any;",
  "}",
  "",
  "export interface PaymentAdapter {",
  "  name: string;",
  "  initialize(params: InitializePaymentParams): Promise<InitializePaymentResult>;",
  "  verify(reference: string): Promise<VerifyPaymentResult>;",
  "  validateWebhook(body: string, signature: string): ValidateWebhookResult;",
  "}",
].join('\n');

fs.writeFileSync('lib/payments/adapter.ts', adapterInterface);
console.log('1 adapter interface created');

// 2. Paystack implementation
const paystackAdapter = [
  "import crypto from 'crypto';",
  "import type { PaymentAdapter, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult, ValidateWebhookResult } from './adapter';",
  "",
  "const BASE = 'https://api.paystack.co';",
  "const SECRET = process.env.PAYSTACK_SECRET_KEY!;",
  "",
  "export const PaystackAdapter: PaymentAdapter = {",
  "  name: 'paystack',",
  "",
  "  async initialize({ email, amount, metadata, currency = 'NGN' }): Promise<InitializePaymentResult> {",
  "    const res = await fetch(BASE + '/transaction/initialize', {",
  "      method: 'POST',",
  "      headers: { Authorization: 'Bearer ' + SECRET, 'Content-Type': 'application/json' },",
  "      body: JSON.stringify({ email, amount, metadata, currency }),",
  "    });",
  "    const data = await res.json();",
  "    if (!data.status) throw new Error(data.message || 'Paystack init failed');",
  "    return {",
  "      authorizationUrl: data.data.authorization_url,",
  "      reference: data.data.reference,",
  "      provider: 'paystack',",
  "    };",
  "  },",
  "",
  "  async verify(reference): Promise<VerifyPaymentResult> {",
  "    const res = await fetch(BASE + '/transaction/verify/' + reference, {",
  "      headers: { Authorization: 'Bearer ' + SECRET },",
  "    });",
  "    const data = await res.json();",
  "    const tx = data.data;",
  "    return {",
  "      success: tx?.status === 'success',",
  "      reference: tx?.reference || reference,",
  "      amount: tx?.amount || 0,",
  "      metadata: tx?.metadata || {},",
  "      provider: 'paystack',",
  "    };",
  "  },",
  "",
  "  validateWebhook(body, signature): ValidateWebhookResult {",
  "    try {",
  "      const hash = crypto.createHmac('sha512', SECRET).update(body).digest('hex');",
  "      if (hash !== signature) return { valid: false, event: '', data: null };",
  "      const parsed = JSON.parse(body);",
  "      return { valid: true, event: parsed.event, data: parsed.data };",
  "    } catch {",
  "      return { valid: false, event: '', data: null };",
  "    }",
  "  },",
  "};",
].join('\n');

fs.writeFileSync('lib/payments/paystack.ts', paystackAdapter);
console.log('2 paystack adapter created');

// 3. Stripe placeholder — swap ready
const stripeAdapter = [
  "import type { PaymentAdapter, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult, ValidateWebhookResult } from './adapter';",
  "",
  "// TODO: npm install stripe then implement",
  "export const StripeAdapter: PaymentAdapter = {",
  "  name: 'stripe',",
  "",
  "  async initialize(params): Promise<InitializePaymentResult> {",
  "    throw new Error('Stripe adapter not implemented yet');",
  "  },",
  "",
  "  async verify(reference): Promise<VerifyPaymentResult> {",
  "    throw new Error('Stripe adapter not implemented yet');",
  "  },",
  "",
  "  validateWebhook(body, signature): ValidateWebhookResult {",
  "    throw new Error('Stripe adapter not implemented yet');",
  "  },",
  "};",
].join('\n');

fs.writeFileSync('lib/payments/stripe.ts', stripeAdapter);
console.log('3 stripe adapter placeholder created');

// 4. Payment provider index — swap here to change provider
const index = [
  "import { PaystackAdapter } from './paystack';",
  "import { StripeAdapter } from './stripe';",
  "import type { PaymentAdapter } from './adapter';",
  "",
  "// Change this one line to swap payment providers",
  "export const paymentProvider: PaymentAdapter = PaystackAdapter;",
  "",
  "export type { PaymentAdapter, PaymentMetadata, InitializePaymentParams, InitializePaymentResult, VerifyPaymentResult, ValidateWebhookResult } from './adapter';",
].join('\n');

fs.writeFileSync('lib/payments/index.ts', index);
console.log('4 payment provider index created — swap provider in one line');

// 5. Update initialize route to use adapter
const initRoute = [
  "import { NextRequest, NextResponse } from 'next/server';",
  "import { auth, currentUser } from '@clerk/nextjs/server';",
  "import { paymentProvider } from '@/lib/payments';",
  "",
  "export async function POST(request: NextRequest) {",
  "  try {",
  "    const { userId } = await auth();",
  "    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });",
  "",
  "    const user = await currentUser();",
  "    const email = user?.emailAddresses?.[0]?.emailAddress;",
  "    if (!email) return NextResponse.json({ success: false, error: 'No email found' }, { status: 400 });",
  "",
  "    const body = await request.json();",
  "    const { amount, metadata } = body;",
  "    if (!amount) return NextResponse.json({ success: false, error: 'Missing amount' }, { status: 400 });",
  "",
  "    const result = await paymentProvider.initialize({",
  "      email,",
  "      amount,",
  "      metadata: { ...metadata, userId },",
  "    });",
  "",
  "    return NextResponse.json({ success: true, data: { authorization_url: result.authorizationUrl, reference: result.reference } }, { status: 200 });",
  "  } catch (error) {",
  "    console.error('Initialize error:', error);",
  "    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });",
  "  }",
  "}",
].join('\n');

fs.writeFileSync('app/api/paystack/initialize/route.ts', initRoute);
console.log('5 initialize route uses adapter');

// 6. Update webhook route to use adapter
const webhookRoute = [
  "import { NextRequest, NextResponse } from 'next/server';",
  "import { paymentProvider } from '@/lib/payments';",
  "import { ConvexHttpClient } from 'convex/browser';",
  "import { api } from '@/convex/_generated/api';",
  "",
  "const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);",
  "",
  "export async function POST(request: NextRequest) {",
  "  try {",
  "    const signature = request.headers.get('x-paystack-signature') || request.headers.get('stripe-signature') || '';",
  "    const body = await request.text();",
  "",
  "    const { valid, event, data } = paymentProvider.validateWebhook(body, signature);",
  "    if (!valid) return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });",
  "",
  "    if (event === 'charge.success' || event === 'payment_intent.succeeded') {",
  "      const userId = data?.metadata?.userId;",
  "      const type = data?.metadata?.type;",
  "      if (!userId) return NextResponse.json({ success: true }, { status: 200 });",
  "",
  "      if (type === 'credits') {",
  "        const credits = data?.metadata?.credits || 0;",
  "        await convex.mutation(api.subscriptions.addCredits, { userId, credits });",
  "        console.log('Credits added:', credits, 'userId:', userId);",
  "      } else if (type === 'subscription') {",
  "        const plan = data?.metadata?.plan || 'pro';",
  "        await convex.mutation(api.subscriptions.updateSubscription, { userId, plan, status: 'active' });",
  "        const limits: Record<string, number> = { pro: 500, starter: 500 };",
  "        await convex.mutation(api.subscriptions.addCredits, { userId, credits: limits[plan] || 500 });",
  "        console.log('Plan upgraded:', plan, 'userId:', userId);",
  "      }",
  "    }",
  "",
  "    return NextResponse.json({ success: true }, { status: 200 });",
  "  } catch (error) {",
  "    console.error('Webhook error:', error);",
  "    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });",
  "  }",
  "}",
].join('\n');

fs.writeFileSync('app/api/paystack/webhook/route.ts', webhookRoute);
console.log('6 webhook route uses adapter');

// 7. Update verify route to use adapter
const verifyRoute = [
  "import { NextRequest, NextResponse } from 'next/server';",
  "import { paymentProvider } from '@/lib/payments';",
  "import { auth } from '@clerk/nextjs/server';",
  "import { ConvexHttpClient } from 'convex/browser';",
  "import { api } from '@/convex/_generated/api';",
  "",
  "const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);",
  "",
  "export async function GET(request: NextRequest) {",
  "  try {",
  "    const { userId } = await auth();",
  "    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });",
  "",
  "    const { searchParams } = new URL(request.url);",
  "    const reference = searchParams.get('reference');",
  "    if (!reference) return NextResponse.json({ success: false, error: 'Missing reference' }, { status: 400 });",
  "",
  "    const result = await paymentProvider.verify(reference);",
  "",
  "    if (result.success) {",
  "      const { type, credits, plan } = result.metadata;",
  "      if (type === 'credits' && credits) {",
  "        await convex.mutation(api.subscriptions.addCredits, { userId, credits });",
  "      } else if (type === 'subscription' && plan) {",
  "        await convex.mutation(api.subscriptions.updateSubscription, { userId, plan, status: 'active' });",
  "      }",
  "    }",
  "",
  "    return NextResponse.json({ success: result.success, data: result }, { status: 200 });",
  "  } catch (error) {",
  "    console.error('Verify error:', error);",
  "    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });",
  "  }",
  "}",
].join('\n');

fs.writeFileSync('app/api/paystack/verify/route.ts', verifyRoute);
console.log('7 verify route uses adapter');

console.log('\nDone. To swap to Stripe later: change one line in lib/payments/index.ts');
