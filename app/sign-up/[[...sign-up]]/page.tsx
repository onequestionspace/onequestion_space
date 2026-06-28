'use client';

import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const clerkAppearance = {
  variables: {
    colorBackground: '#0f0f0f',
    colorInputBackground: 'rgba(255,255,255,0.06)',
    colorInputText: '#ffffff',
    colorNeutral: '#ffffff',
    colorText: '#ffffff',
    colorTextSecondary: '#a1a1aa',
    colorPrimary: '#9333ea',
    colorDanger: '#ef4444',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },
  elements: {
    formButtonPrimary: "!bg-gradient-to-r !bg-primary !text-white !font-bold !text-sm !rounded-xl !py-3 !border-0 hover:!opacity-90 !transition-all",
    card: "!bg-transparent !shadow-none !border-none !p-0",
    headerTitle: "!hidden",
    headerSubtitle: "!hidden",
    socialButtonsBlockButton: "!bg-white/8 !border !border-white/15 !text-white !rounded-xl !font-medium hover:!bg-white/15 !transition-all",
    socialButtonsBlockButtonText: "!text-white !font-medium",
    footerActionLink: "!text-primary hover:!text-primary/80",
    footerActionText: "!text-zinc-400",
    formFieldInput: "!bg-white/8 !border !border-white/15 !text-white !rounded-xl !py-3 !px-4 focus:!border-primary/60 focus:!ring-2 focus:!ring-primary/20 !transition-all placeholder:!text-zinc-500",
    formFieldLabel: "!text-zinc-300 !font-medium !text-sm",
    dividerLine: "!bg-white/10",
    dividerText: "!text-zinc-500 !text-xs",
    identityPreviewText: "!text-white",
    identityPreviewEditButton: "!text-primary",
    formResendCodeLink: "!text-primary",
    otpCodeFieldInput: "!bg-white/8 !border !border-white/15 !text-white !rounded-xl",
    alertText: "!text-red-400",
    formFieldErrorText: "!text-red-400 !text-xs",
    rootBox: "!w-full !max-w-full !overflow-hidden",
    form: "!gap-4",
  },
  layout: {
    socialButtonsPlacement: 'top',
  }
};

function SignUpContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';

  return (
    <AuthLayout
      title="Create Your Space"
      subtitle={username ? 'Claiming onequestion.space/' + username : 'Join the future of knowledge sharing'}
    >
      {username && (
        <div className="rounded-2xl p-4 border border-primary/30 bg-primary/10 mb-4 text-center">
          <p className="text-xs text-zinc-400 mb-1">Your space will be</p>
          <p className="text-primary font-bold">onequestion.space/{username}</p>
        </div>
      )}
      <div className="flex justify-center w-full">
        <SignUp afterSignUpUrl="/onboarding" afterSignInUrl="/dashboard"
          forceRedirectUrl={username ? '/onboarding?username=' + username : '/onboarding'}
          signInForceRedirectUrl="/dashboard"
          signInUrl="/sign-in"
          appearance={clerkAppearance}
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
