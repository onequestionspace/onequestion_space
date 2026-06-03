'use client';

import { SignIn } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to manage your AI space"
    >
      <div className="flex justify-center">
        <SignIn 
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
