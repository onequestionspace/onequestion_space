'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Clock, 
  ExternalLink, 
  ShieldCheck,
  Package,
  ArrowRight
} from 'lucide-react';

/**
 * Enhanced Billing Page
 * Subscription management with Paystack integration placeholders
 */
export default function BillingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [isUpgrading, setIsUpgrading] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect('/');
  }

  const currentPlan = {
    name: 'Free',
    status: 'active',
    usage: 12,
    limit: 50,
    renewalDate: '2024-06-20',
  };

  const plans = [
    {
      name: 'Pro',
      price: '$29',
      interval: 'month',
      description: 'For serious creators and professionals',
      features: [
        'Unlimited AI Questions',
        'Custom Domain Support',
        'Advanced Analytics',
        'Priority AI Processing',
        'Remove One Question Branding',
      ],
      cta: 'Upgrade to Pro',
      highlight: true,
    },
    {
      name: 'Business',
      price: '$99',
      interval: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team Collaboration',
        'Private Knowledge Bases',
        'Dedicated Support',
        'API Access',
      ],
      cta: 'Contact Sales',
      highlight: false,
    }
  ];

  return (
    <DashboardLayout title="Billing" description="Manage your subscription and payment methods.">
      <div className="space-y-8">
        
        {/* Current Plan Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-2xl p-8 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Package className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Current Plan: {currentPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">Your subscription is {currentPlan.status}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Usage (Questions this month)</span>
                    <span className="text-foreground font-medium">{currentPlan.usage} / {currentPlan.limit}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${(currentPlan.usage / currentPlan.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Renews on {currentPlan.renewalDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">No payment method added</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-8 border border-border flex flex-col justify-center space-y-4">
            <button className="w-full py-3 px-4 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-primary/10 transition-all flex items-center justify-between group">
              View Invoices
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button className="w-full py-3 px-4 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-primary/10 transition-all flex items-center justify-between group">
              Update Payment Method
              <CreditCard className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Upgrade Plans */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan, i) => (
              <div key={i} className={`glass-card rounded-2xl p-8 border transition-all ${
                plan.highlight ? 'border-primary/50 bg-primary/5 shadow-glow-primary/20' : 'border-border hover:border-primary/30'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-1">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => setIsUpgrading(true)}
                  disabled={isUpgrading}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.highlight 
                      ? 'bg-primary text-white hover:shadow-glow-primary' 
                      : 'bg-card border border-border text-foreground hover:bg-primary/10'
                  }`}
                >
                  {isUpgrading ? 'Redirecting to Paystack...' : plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="glass-card rounded-2xl p-8 border border-border bg-gradient-to-r from-primary/5 to-pink/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">Need a custom plan?</h4>
              <p className="text-sm text-muted-foreground">Contact our team for enterprise-grade solutions.</p>
            </div>
          </div>
          <button className="px-8 py-3 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all">
            Talk to Sales
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
