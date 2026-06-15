'use client';

import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";

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
    formButtonPrimary: "!bg-gradient-to-r !from-purple-600 !to-rose-500 !text-white !font-bold !text-sm !rounded-xl !py-3 !border-0 hover:!opacity-90 !transition-all",
    card: "!bg-transparent !shadow-none !border-none !p-0",
    headerTitle: "!hidden",
    headerSubtitle: "!hidden",
    socialButtonsBlockButton: "!bg-white/8 !border !border-white/15 !text-white !rounded-xl !font-medium hover:!bg-white/15 !transition-all",
    socialButtonsBlockButtonText: "!text-white !font-medium",
    footerActionLink: "!text-purple-400 hover:!text-purple-300",
    footerActionText: "!text-zinc-400",
    formFieldInput: "!bg-white/8 !border !border-white/15 !text-white !rounded-xl !py-3 !px-4 focus:!border-purple-500/60 focus:!ring-2 focus:!ring-purple-500/20 !transition-all placeholder:!text-zinc-500",
    formFieldLabel: "!text-zinc-300 !font-medium !text-sm",
    dividerLine: "!bg-white/10",
    dividerText: "!text-zinc-500 !text-xs",
    identityPreviewText: "!text-white",
    identityPreviewEditButton: "!text-purple-400",
    formResendCodeLink: "!text-purple-400",
    otpCodeFieldInput: "!bg-white/8 !border !border-white/15 !text-white !rounded-xl",
    alertText: "!text-red-400",
    formFieldErrorText: "!text-red-400 !text-xs",
    rootBox: "!w-full",
    form: "!gap-4",
  },
  layout: {
    socialButtonsPlacement: 'top',
  }
};

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to manage your AI space"
    >
      <div className="flex justify-center w-full">
        <SignIn
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
          appearance={clerkAppearance}
        />
      </div>
    </AuthLayout>
  );
}
