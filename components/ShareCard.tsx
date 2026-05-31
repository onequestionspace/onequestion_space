'use client';

import { useState } from 'react';

interface ShareCardProps {
  username: string;
  title?: string;
  description?: string;
}

/**
 * Share Card Component
 * Display shareable link and social sharing options
 */
export function ShareCard({ username, title = 'Ask me anything!', description }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOnTwitter = () => {
    const text = `Check out my Q&A page: ${title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Page</h3>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Your Q&A Link</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-3">Share on Social Media</p>
        <div className="flex space-x-3">
          <button
            onClick={shareOnTwitter}
            className="flex-1 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 font-medium"
          >
            Twitter
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-medium"
          >
            LinkedIn
          </button>
        </div>
      </div>

      {description && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">{description}</p>
        </div>
      )}
    </div>
  );
}
