'use client';

/**
 * How It Works Section Component
 * Step-by-step process visualization
 */
export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Create Your Space',
      description: 'Set up your Q-Page in seconds with a custom username',
      icon: '🚀',
    },
    {
      number: 2,
      title: 'Upload Knowledge',
      description: 'Share your expertise, documents, and FAQs',
      icon: '📚',
    },
    {
      number: 3,
      title: 'Share Your Link',
      description: 'Get a unique URL to share with your audience',
      icon: '🔗',
    },
    {
      number: 4,
      title: 'AI Answers Instantly',
      description: 'Let AI handle visitor questions 24/7',
      icon: '⚡',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-20 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-cyber-purple rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-400">Four simple steps to launch your AI-powered Q-Page</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Card */}
              <div className="bg-cyber-gray border border-cyber-purple/20 rounded-2xl p-8 h-full hover:border-cyber-purple/50 transition-all hover:shadow-glow-purple">
                {/* Step number badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyber-purple to-cyber-red rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-4">{step.icon}</div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-cyber-purple to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
