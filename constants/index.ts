// App Configuration
export const APP_NAME = 'One Question';
export const APP_TAGLINE = 'Your knowledge. Your answers. Your space.';
export const APP_DESCRIPTION = 'Create your own AI-powered Q&A page. Upload knowledge once. AI answers visitor questions forever.';

// URLs
export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Pricing Plans - Message-based tiers
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'USD',
    messages: 30,
    description: 'Perfect for getting started',
    features: [
      '30 messages/month',
      'Basic AI responses',
      'Public profile',
      'Community support',
    ],
    cta: 'Get Started',
    highlighted: false,
    comingSoon: false,
  },
  starter: {
    name: 'Starter',
    price: 9,
    currency: 'USD',
    messages: 500,
    description: 'For growing creators',
    features: [
      '500 messages/month',
      'Advanced AI responses',
      'Custom domain',
      'Analytics dashboard',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    comingSoon: false,
  },
  pro: {
    name: 'Pro',
    price: 29,
    currency: 'USD',
    messages: 2000,
    description: 'For serious creators',
    features: [
      '2,000 messages/month',
      'Premium AI responses',
      'Multiple Q&A pages',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Coming Soon',
    highlighted: false,
    comingSoon: true,
  },
  business: {
    name: 'Business',
    price: 49,
    currency: 'USD',
    messages: 'unlimited',
    description: 'For teams and enterprises',
    features: [
      'Unlimited messages',
      'Everything in Pro',
      'Team access',
      'Private spaces',
      'Dedicated support',
      'Custom integrations',
    ],
    cta: 'Coming Soon',
    highlighted: false,
    comingSoon: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    currency: 'USD',
    messages: 'unlimited',
    description: 'Custom solutions',
    features: [
      'Unlimited everything',
      'Custom features',
      'API access',
      'SLA guarantee',
      'Dedicated account manager',
      'White-label options',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    comingSoon: true,
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
  checkUsername: '/api/check-username',
  paystack: {
    initialize: '/api/paystack/initialize',
    verify: '/api/paystack/verify',
    webhook: '/api/paystack/webhook',
  },
};
