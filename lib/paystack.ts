/**
 * Paystack Payment Integration
 * Handles payment processing and verification
 */

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

/**
 * Initialize payment transaction
 * @param email - Customer email
 * @param amount - Amount in kobo (NGN * 100)
 * @param metadata - Additional metadata
 * @returns Authorization URL and reference
 */
export async function initializePayment(
  email: string,
  amount: number,
  metadata?: Record<string, any>
) {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
}

/**
 * Verify payment transaction
 * @param reference - Payment reference from Paystack
 * @returns Transaction details
 */
export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to verify payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/**
 * Validate Paystack webhook signature
 * @param body - Request body
 * @param signature - X-Paystack-Signature header
 * @returns Whether signature is valid
 */
export function validateWebhookSignature(
  body: string,
  signature: string
): boolean {
  try {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Error validating webhook signature:', error);
    return false;
  }
}

/**
 * Create payment plan
 * @param name - Plan name
 * @param description - Plan description
 * @param amount - Amount in kobo
 * @param interval - Billing interval (monthly, quarterly, biannually, annually)
 * @returns Plan details
 */
export async function createPaymentPlan(
  name: string,
  description: string,
  amount: number,
  interval: string
) {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        amount,
        interval,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment plan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment plan:', error);
    throw error;
  }
}

/**
 * Get payment plans
 * @returns List of payment plans
 */
export async function getPaymentPlans() {
  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/plan`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment plans');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    throw error;
  }
}
