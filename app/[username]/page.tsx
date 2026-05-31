'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { validateQuestion } from '@/lib/validations';

/**
 * Public Q&A Page
 * Visitor-facing page for asking questions
 */
export default function PublicQAPage({ params }: { params: { username: string } }) {
  const [question, setQuestion] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate question
    const questionError = validateQuestion(question);
    if (questionError) {
      alert(questionError.message);
      return;
    }

    try {
      await execute('/api/ask', {
        method: 'POST',
        body: JSON.stringify({
          question,
          username: params.username,
          visitorName,
        }),
      });
      setSubmitted(true);
      setQuestion('');
      setVisitorName('');
    } catch (err) {
      console.error('Error submitting question:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* TODO: Fetch and display user profile */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">@{params.username}</h1>
          <p className="text-gray-600 mb-4">Ask me anything!</p>
        </div>

        {/* Question Form */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ask a Question</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">Thank you for your question!</p>
              <p className="text-green-700 text-sm">You&apos;ll receive an answer soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask your question here..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error.message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
              >
                {loading ? 'Submitting...' : 'Submit Question'}
              </button>
            </form>
          )}
        </div>

        {/* TODO: Display answer feed */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Answers</h2>
          <p className="text-gray-600">Answers will appear here</p>
        </div>
      </div>
    </div>
  );
}
