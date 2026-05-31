'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { validateKnowledgeTitle, validateKnowledgeContent, validateFile } from '@/lib/validations';

interface UploadKnowledgeProps {
  onSuccess?: () => void;
}

/**
 * Upload Knowledge Component
 * Form for uploading knowledge base content
 */
export function UploadKnowledge({ onSuccess }: UploadKnowledgeProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    const titleError = validateKnowledgeTitle(title);
    if (titleError) {
      alert(titleError.message);
      return;
    }

    const contentError = validateKnowledgeContent(content);
    if (contentError) {
      alert(contentError.message);
      return;
    }

    const fileError = validateFile(file);
    if (fileError) {
      alert(fileError.message);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (file) {
        formData.append('file', file);
      }

      await execute('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setTitle('');
      setContent('');
      setFile(null);
      onSuccess?.();
    } catch (err) {
      console.error('Error uploading knowledge:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Knowledge base title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your knowledge base content..."
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
          Upload File (Optional)
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept=".pdf,.txt,.md"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, TXT, MD (Max 10MB)</p>
      </div>

      {error && <p className="text-red-600 text-sm">{error.message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
      >
        {loading ? 'Uploading...' : 'Upload Knowledge'}
      </button>
    </form>
  );
}
