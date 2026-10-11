'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function ClaimPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const claimProfile = useMutation(api.profiles.claimProfile);
  const profile = useQuery(api.profiles.getByClaimToken, { token });
  const claimStarted = useRef(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !profile || claimStarted.current) return;
    if (!profile.isSeeded) return;

    claimStarted.current = true;
    claimProfile({ token })
      .then(() => router.push(`/dashboard`))
      .catch((e) => {
        setClaimError(e instanceof Error ? e.message : 'Failed to claim this page');
      });
  }, [isLoaded, isSignedIn, profile, token, claimProfile, router]);

  if (profile === undefined) return <div className="p-8 text-center">Loading...</div>;
  if (profile === null) return <div className="p-8 text-center">This claim link is invalid.</div>;
  if (claimError) return <div className="p-8 text-center text-red-500">{claimError}</div>;
  if (!profile.isSeeded) return <div className="p-8 text-center text-red-500">This page has already been claimed.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Claim @{profile.username}</h1>
      <p className="text-gray-500">
        We already set up your One Question page. Sign in to make it yours.
      </p>
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <button className="px-6 py-3 rounded-lg bg-black text-white">
            Sign in to claim
          </button>
        </SignInButton>
      ) : (
        <p>Claiming your page...</p>
      )}
    </div>
  );
}
