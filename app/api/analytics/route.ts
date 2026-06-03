import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

/**
 * Analytics API Route
 * Returns dashboard metrics and chart data
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for frontend development
    const data = {
      totalQuestions: 1248,
      answeredQuestions: 1192,
      accuracyRate: 95.5,
      avgResponseTime: '1.2s',
      chartData: [
        { date: 'Mon', count: 45 },
        { date: 'Tue', count: 52 },
        { date: 'Wed', count: 48 },
        { date: 'Thu', count: 61 },
        { date: 'Fri', count: 55 },
        { date: 'Sat', count: 32 },
        { date: 'Sun', count: 28 },
      ],
      popularTopics: [
        { topic: 'Pricing', count: 342 },
        { topic: 'Features', count: 285 },
        { topic: 'Support', count: 156 },
        { topic: 'API Access', count: 98 },
      ]
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
