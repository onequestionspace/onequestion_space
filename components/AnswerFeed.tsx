'use client';

import { formatDateTime } from '@/lib/utils';

interface Answer {
  id: string;
  question: string;
  answer: string;
  visitorName?: string;
  createdAt: number;
  answeredAt?: number;
}

interface AnswerFeedProps {
  answers: Answer[];
  isLoading?: boolean;
}

/**
 * Answer Feed Component
 * Display list of questions and answers
 */
export function AnswerFeed({ answers, isLoading = false }: AnswerFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No answers yet. Be the first to ask a question!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {answers.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          {/* Question */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">
              {item.visitorName || 'Anonymous'} asked
            </p>
            <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
          </div>

          {/* Answer */}
          {item.answer && (
            <div className="bg-gray-50 rounded p-4 mb-4">
              <p className="text-gray-700">{item.answer}</p>
            </div>
          )}

          {/* Metadata */}
          <p className="text-xs text-gray-500">
            {item.answeredAt
              ? `Answered ${formatDateTime(item.answeredAt)}`
              : `Asked ${formatDateTime(item.createdAt)}`}
          </p>
        </div>
      ))}
    </div>
  );
}
