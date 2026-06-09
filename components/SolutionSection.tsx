'use client';

export function SolutionSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          One link.
          <br />
          <span className="gradient-text">Every question answered.</span>
          <br />
          Automatically.
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Create your personal AI space. Anyone who visits can ask one question and get an instant answer — trained on your knowledge, in your voice, 24/7.
        </p>
        <div className="glass rounded-3xl p-6 border border-primary/20 text-left">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-white font-bold text-sm">A</div>
            <div>
              <p className="text-white font-semibold text-sm">onequestion.space/asym</p>
              <p className="text-muted-foreground text-xs">AI Active • Answers instantly</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-white/10 rounded-2xl px-4 py-2 max-w-[80%]">
                <p className="text-white text-sm">How do I work with you?</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-primary/20 border border-primary/20 rounded-2xl px-4 py-2 max-w-[80%]">
                <p className="text-primary text-xs mb-1">AI</p>
                <p className="text-white text-sm">You can book a discovery call directly from my site. I work with early-stage founders on product strategy and technical architecture.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}