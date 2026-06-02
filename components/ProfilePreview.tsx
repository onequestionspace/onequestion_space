'use client';

/**
 * Profile Preview Section Component
 * Shows example of a creator's Q-Page
 */
export function ProfilePreview() {
  return (
    <section className="relative py-20 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyber-purple rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">See It In Action</h2>
          <p className="text-xl text-gray-400">Example: onequestion.space/asym</p>
        </div>

        {/* Profile Preview Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-b from-cyber-purple/10 to-transparent rounded-3xl border border-cyber-purple/30 p-8 backdrop-blur-sm">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-red flex items-center justify-center text-2xl font-bold text-white">
                A
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">@asym</p>
                <p className="text-gray-400">Founder & CEO at One Question</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-300 mb-8 leading-relaxed">
              Ask me anything about building AI-powered products, startup strategy, and technical architecture.
            </p>

            {/* Question Input */}
            <div className="bg-cyber-black/50 rounded-xl p-6 mb-6 border border-cyber-purple/20">
              <label className="block text-gray-400 text-sm font-medium mb-3">Ask a question:</label>
              <textarea
                placeholder="What's your approach to MVP development?"
                className="w-full bg-cyber-gray text-white placeholder-gray-500 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:border-transparent resize-none"
                rows={3}
              />
              <button className="mt-4 w-full bg-gradient-to-r from-cyber-purple to-cyber-red text-white font-bold py-3 rounded-lg hover:shadow-glow-purple-lg transition-all">
                Submit Question
              </button>
            </div>

            {/* Sample Answer */}
            <div className="bg-cyber-purple/5 rounded-xl p-6 border border-cyber-purple/30">
              <p className="text-gray-400 text-sm mb-2">
                <span className="text-cyber-purple font-semibold">Question:</span> How do you prioritize features?
              </p>
              <p className="text-gray-300 leading-relaxed">
                <span className="text-cyber-yellow font-semibold">AI Answer:</span> I prioritize based on user impact and implementation complexity. We use a simple framework: high impact + low effort = build first. This helps us ship value quickly while maintaining momentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
