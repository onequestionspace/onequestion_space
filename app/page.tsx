'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { HOW_IT_WORKS } from '@/constants';

/**
 * Homepage
 * Landing page with hero section and how it works
 */
export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Stop answering the same question twice.
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Upload your knowledge once. Let AI answer forever.
          </p>

          {isLoaded && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg"
                  >
                    Claim Your Space
                  </Link>
                  <Link
                    href="/waitlist"
                    className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-semibold text-lg"
                  >
                    Join Waitlist
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Feature Highlight */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <p className="text-center text-gray-600 text-lg">
            <span className="font-semibold text-gray-900">Your knowledge. Your answers. Your space.</span>
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Why One Question?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Get instant AI-powered answers to your most frequently asked questions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Data, Your Control</h3>
              <p className="text-gray-600">
                Keep your knowledge private and secure. You control what gets shared.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scale Effortlessly</h3>
              <p className="text-gray-600">
                Handle unlimited questions without hiring more support staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who are saving time with AI-powered Q&A pages.
          </p>

          {isLoaded && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/sign-up"
                    className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                  >
                    Claim Your Space
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg"
                  >
                    View Pricing
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
