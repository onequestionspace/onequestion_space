'use client';

import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignUpContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';

  return (
    <AuthLayout
      title="Create Your Space"
      subtitle={username ? 'Claiming onequestion.space/' + username : 'Join the future of knowledge sharing'}
    >
      {username && (
        <div className="glass rounded-2xl p-4 border border-primary/30 mb-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Your space will be</p>
          <p className="text-primary font-bold">onequestion.space/{username}</p>
        </div>
      )}
      <div className="flex justify-center">
        <SignUp
          forceRedirectUrl={username ? '/onboarding?username=' + username : '/onboarding'}
          signInForceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm font-bold",
              card: "bg-transparent shadow-none border-none p-0",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "bg-card border-border text-foreground hover:bg-muted/50",
              footerActionLink: "text-primary hover:text-pink",
              formFieldInput: "bg-card border-border text-foreground focus:ring-primary",
              formFieldLabel: "text-foreground font-medium",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
            }
          }}
        />
      </div>
    </AuthLayout>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpContent />
    </Suspense>
  );
}