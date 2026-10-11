'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ClaimPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const claimProfile = useMutation(api.profiles.claimProfile);
  const profile = useQuery(api.profiles.getByClaimToken, { token });
  const claiming = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !profile || claiming.current) return;
    if (!profile.isSeeded) return;

    claiming.current = true;
    claimProfile({ token })
      .then(() => router.push(`/dashboard`))
      .catch((e) => setError(e.message || 'Failed to claim this page'));
  }, [isLoaded, isSignedIn, profile, token, claimProfile, router]);

  if (profile === undefined) return <div className="p-8 text-center">Loading...</div>;
  if (profile === null) return <div className="p-8 text-center">This claim link is invalid.</div>;
  if (isLoaded && isSignedIn && !profile.isSeeded) {
    return <div className="p-8 text-center">This page has already been claimed.</div>;
  }
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Claim @{profile.username}</h1>
      <p className="text-gray-500">
        Your page is ready. Sign in with the email address this invitation was sent to, then make it yours.
      </p>
      {!isSignedIn ? (
        <div className="flex flex-wrap justify-center gap-3">
          <SignUpButton mode="modal" forceRedirectUrl={`/claim/${token}`}>
            <button className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white">Create your account</button>
          </SignUpButton>
          <SignInButton mode="modal" forceRedirectUrl={`/claim/${token}`}>
            <button className="rounded-lg border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-800">Already have an account? Sign in</button>
          </SignInButton>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Claiming your page…</p>
      )}
    </div>
  );
}
