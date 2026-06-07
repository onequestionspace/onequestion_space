'use client';
import Image from 'next/image';

/**
 * Profile Preview Section Component
 * Shows example of a creator's Q-Page in Linktree style
 */
export function ProfilePreview() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See It <span className="gradient-text-alt">In Action</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            onequestion.space/<span className="text-primary">asym</span>
          </p>
        </div>

        {/* Profile Preview Card */}
        <div className="max-w-lg mx-auto">
          <div className="glass rounded-3xl p-8 card-hover">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent-pink to-accent-red flex items-center justify-center text-3xl font-bold text-white mb-4 ring-4 ring-white/10">
                A
              </div>
              <h3 className="text-white font-bold text-2xl">@asym</h3>
              <p className="text-muted-foreground">Founder & CEO at One Question</p>
            </div>

            {/* Bio */}
            <p className="text-center text-muted-foreground mb-8 leading-relaxed">
              Ask me anything about building AI-powered products, startup strategy, and technical architecture.
            </p>

            {/* Question Input */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
              <label className="block text-sm font-medium text-muted-foreground mb-3">Ask a question:</label>
              <textarea
                placeholder="What's your approach to MVP development?"
                className="w-full bg-background/50 text-white placeholder-muted-foreground rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary border border-white/10 resize-none"
                rows={3}
              />
              <button className="mt-4 w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl hover:shadow-glow transition-all">
                Submit Question
              </button>
            </div>

            {/* Sample Answer */}
            <div className="bg-gradient-to-br from-primary/10 to-accent-pink/10 rounded-2xl p-6 border border-primary/20">
              <p className="text-muted-foreground text-sm mb-3">
                <span className="text-primary font-medium">Question:</span> How do you prioritize features?
              </p>
              <p className="text-white leading-relaxed">
                <span className="text-accent-yellow font-medium">AI Answer:</span> I prioritize based on user impact and implementation complexity. High impact + low effort = build first. This helps ship value quickly while maintaining momentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
