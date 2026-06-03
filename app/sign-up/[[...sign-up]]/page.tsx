'use client';

import { SignUp } from "@clerk/nextjs";
import { AuthLayout } from "@/components/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout 
      title="Create Your Space" 
      subtitle="Join the future of knowledge sharing"
    >
      <div className="flex justify-center">
        <SignUp 
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
