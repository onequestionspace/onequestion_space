'use client';

import { Brain, MessageCircle, Link as LinkIcon } from 'lucide-react';

export function ProductExplainer() {
  const features = [
    {
      icon: LinkIcon,
      title: 'Claim Your Space',
      description: 'Get a personal page at onequestion.space/yourname that represents you.',
    },
    {
      icon: Brain,
      title: 'Upload Your Knowledge',
      description: 'Add your FAQs, documents, and expertise. Your AI learns from what you share.',
    },
    {
      icon: MessageCircle,
      title: 'AI Answers For You',
      description: 'Anyone who visits your page asks one question and gets an instant AI-powered answer — without bothering you.',
    },
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What is One Question?
          </h2>
          <p className="text-zinc-400 text-base max-w-2xl mx-auto">
            Stop answering the same questions over and over. Create your space, upload your knowledge, and let AI handle it for you — 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="paper-card p-6">
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
