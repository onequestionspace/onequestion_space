'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { validateQuestion } from '@/lib/validations';

interface AskFormProps {
  username: string;
  onSuccess?: () => void;
}

/**
 * Ask Question Form Component
 * Reusable form for submitting questions
 */
export function AskForm({ username, onSuccess }: AskFormProps) {
  const [question, setQuestion] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          username,
          visitorName,
          visitorEmail,
        }),
      });

      setQuestion('');
      setVisitorName('');
      setVisitorEmail('');
      onSuccess?.();
    } catch (err) {
      console.error('Error submitting question:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700 mb-2">
          Your Name (Optional)
        </label>
        <input
          type="text"
          id="visitorName"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="visitorEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Your Email (Optional)
        </label>
        <input
          type="email"
          id="visitorEmail"
          value={visitorEmail}
          onChange={(e) => setVisitorEmail(e.target.value)}
          placeholder="your@email.com"
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
  );
}
