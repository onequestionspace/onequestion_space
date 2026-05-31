// App Configuration
export const APP_NAME = 'One Question';
export const APP_TAGLINE = 'Your knowledge. Your answers. Your space.';
export const APP_DESCRIPTION = 'Create your own AI-powered Q&A page. Upload knowledge once. AI answers visitor questions forever.';

// URLs
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Pricing Plans
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'One Q&A page',
      'Up to 100 questions/month',
      'Basic analytics',
      'Community support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 99,
    currency: 'NGN',
    features: [
      'Unlimited Q&A pages',
      'Unlimited questions',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
  },
};

// How It Works Steps
export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Create Page',
    description: 'Set up your Q&A page in seconds',
  },
  {
    step: 2,
    title: 'Upload Knowledge',
    description: 'Share your expertise and documents',
  },
  {
    step: 3,
    title: 'Share Link',
    description: 'Get a unique URL for your page',
  },
  {
    step: 4,
    title: 'AI Answers',
    description: 'Let AI handle visitor questions',
  },
];

// Navigation Links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/dashboard', label: 'Dashboard' },
];

// File Upload Limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'text/markdown'];

// Question Limits
export const MAX_QUESTION_LENGTH = 500;
export const MAX_KNOWLEDGE_LENGTH = 50000;

// API Endpoints
export const API_ENDPOINTS = {
  ask: '/api/ask',
  upload: '/api/upload',
  waitlist: '/api/waitlist',
  paystack: {
    initialize: '/api/paystack/initialize',
    verify: '/api/paystack/verify',
    webhook: '/api/paystack/webhook',
  },
};
