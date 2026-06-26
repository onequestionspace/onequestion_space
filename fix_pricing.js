const fs = require('fs');

let p = fs.readFileSync('components/PricingSection.tsx', 'utf8');

// Kill purple radial
p = p.replace(
  `      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08),transparent_70%)]' />`,
  ``
);

// Fix headline — more human, Asym's voice
p = p.replace(
  `          <h2 className='text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4'>
            Simple pricing.<br /><span className='gradient-text'>No surprises.</span>
          </h2>
          <p className='text-zinc-400 text-lg'>Start free. Upgrade when your audience grows.</p>`,
  `          <h2 className='text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4'>
            Honest pricing.<br /><span className='text-primary'>No BS.</span>
          </h2>
          <p className='text-zinc-400 text-lg leading-relaxed'>Start free. Pay only when it's worth it to you.</p>`
);

// Fix MOST POPULAR badge — black text on amber
p = p.replace(
  `              <span className='px-4 py-1 rounded-full text-xs font-bold bg-primary text-white'>MOST POPULAR</span>`,
  `              <span className='px-4 py-1 rounded-full text-xs font-bold bg-primary text-black'>MOST POPULAR</span>`
);

// Fix Pro button — black text
p = p.replace(
  `              <Zap className='w-4 h-4' /> Start with Pro`,
  `              <Zap className='w-4 h-4' /> Start with Pro →`
);

p = p.replace(
  `className='w-full py-3.5 rounded-2xl bg-primary text-white text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 block'`,
  `className='w-full py-3.5 rounded-2xl bg-primary text-black text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 block'`
);

// Add Asym's personal note + FAQ after the grid
p = p.replace(
  `        <p className='text-center text-zinc-600 text-sm mt-8'>Need more? Buy credits anytime from your dashboard. No commitment.</p>`,
  `        <p className='text-center text-zinc-600 text-sm mt-8'>Need more? Buy credits anytime from your dashboard. No commitment.</p>

        {/* Asym's personal note */}
        <div className='mt-12 p-6 rounded-2xl border border-white/8 bg-white/3'>
          <p className='text-zinc-300 text-sm leading-loose'>
            I built this on an Android phone with no funding, no team, no laptop — just Termux and a lot of late nights in Kaduna.
            The $9/month keeps the servers running and helps me keep building.
            If One Question saves you even one hour a month, it's worth it.
          </p>
          <p className='text-primary text-sm font-bold mt-3'>— Asym, founder</p>
        </div>

        {/* FAQ */}
        <div className='mt-12 space-y-6'>
          <h3 className='text-xl font-black text-white tracking-tight'>Questions people actually ask</h3>
          {[
            {
              q: 'Is the free plan actually free?',
              a: 'Yes. No credit card, no trial period, no expiry. 50 AI answers a month forever. I hate fake free tiers.'
            },
            {
              q: 'What happens if I hit my limit?',
              a: 'Your space stays live — visitors just see a friendly message that answers are paused. You can buy extra credits or upgrade anytime.'
            },
            {
              q: 'Can I cancel Pro anytime?',
              a: 'Yes. One click. No emails asking why. No retention flow. Just cancel.'
            },
            {
              q: 'Why $9?',
              a: "Honest answer: it covers Gemini API costs, Convex, Vercel, and lets me keep building. It's not a number a VC told me — it's what makes sense."
            },
          ].map((faq, i) => (
            <div key={i} className='border-b border-white/8 pb-6'>
              <p className='text-white font-bold text-sm mb-2'>{faq.q}</p>
              <p className='text-zinc-400 text-sm leading-relaxed'>{faq.a}</p>
            </div>
          ))}
        </div>`
);

fs.writeFileSync('components/PricingSection.tsx', p);
console.log('PricingSection done');
