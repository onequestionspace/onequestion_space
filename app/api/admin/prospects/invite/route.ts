import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { isAdminUser } from '@/convex/userIds';
import { validateEmail } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !isAdminUser(userId)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
    const { email, claimToken } = body as { email?: unknown; claimToken?: unknown };
    if (typeof email !== 'string' || validateEmail(email.trim().toLowerCase())) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address' }, { status: 400 });
    }
    if (typeof claimToken !== 'string' || !/^[0-9a-f-]{36}$/i.test(claimToken)) {
      return NextResponse.json({ success: false, error: 'Invalid page claim link' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://onequestion.space');
    const client = await clerkClient();
    const invitation = await client.invitations.createInvitation({
      emailAddress: email.trim().toLowerCase(),
      redirectUrl: `${baseUrl.replace(/\/$/, '')}/claim/${claimToken}`,
      ignoreExisting: true,
      notify: true,
    });

    return NextResponse.json({ success: true, data: { invitationId: invitation.id } });
  } catch (error) {
    console.error('Prospect invitation failed:', error);
    return NextResponse.json({ success: false, error: 'Could not send the invitation. Check Clerk email settings and try again.' }, { status: 500 });
  }
}
