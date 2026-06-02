'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Check, CreditCard, Zap } from 'lucide-react';

/**
 * Billing Page
 * Manage subscription and payment with brand design
 */
export default function BillingPage() {
  const { isSignedIn, isLoaded } = useAuth();

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

  return (
    <DashboardLayout title="Billing" description="Manage your subscription and payment methods.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Current Plan</h2>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Free
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">5 questions per month</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Basic AI responses</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Standard support</span>
            </div>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-pink text-white font-medium hover:shadow-glow-primary transition-all"
          >
            <Zap className="w-4 h-4" />
            Upgrade Plan
          </Link>
        </div>

        {/* Payment Method */}
        <div className="glass-card rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-6">Payment Method</h2>
          
          <div className="border border-dashed border-border rounded-xl p-6 text-center">
            <CreditCard className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-4">No payment method added</p>
            <button className="text-primary text-sm hover:underline">
              Add payment method
            </button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-6 glass-card rounded-2xl p-6 border border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">Billing History</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No billing history</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
