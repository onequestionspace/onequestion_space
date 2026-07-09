import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const profile = await convex.query(api.profiles.current);
    if (!profile) return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });

    const analytics = await convex.query(api.analytics.getAnalytics, { profileId: profile._id });
    const questions = await convex.query(api.questions.getQuestionsByProfile, { profileId: profile._id });

    const answered = questions?.filter(q => q.isAnswered).length ?? 0;
    const pending = questions?.filter(q => !q.isAnswered).length ?? 0;
    const responseRate = questions && questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalQuestions: analytics?.totalQuestions ?? questions?.length ?? 0,
        totalAnswers: analytics?.totalAnswers ?? answered ?? 0,
        totalVisitors: analytics?.totalVisitors ?? 0,
        responseRate,
        answered,
        pending,
        questionsCount: questions?.length ?? 0,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/analytics:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
