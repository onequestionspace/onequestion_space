'use client';

export function StorySection() {
  return (
    <section className='relative py-20 overflow-hidden'>
      <div className='relative z-10 max-w-2xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row items-start gap-8 p-8 rounded-3xl border border-white/8 bg-white/3'>
          <img src='/founders/asym.png' alt='Asym' className='w-20 h-20 rounded-2xl object-cover shrink-0' />
          <div>
            <p className='text-amber-400 text-xs font-bold uppercase tracking-widest mb-4'>Why I built this</p>
            <div className='space-y-3 text-zinc-300 text-sm leading-relaxed'>
              <p>I was 18, building in public, answering the same questions in my DMs every single day.</p>
              <p>No laptop. No funding. Just a phone, Termux, and the problem in front of me.</p>
              <p>So I built the thing I needed. One page. My knowledge. My AI. My voice — even when I am asleep.</p>
              <p className='text-white font-medium'>That is One Question. I hope it gives you back the time it gave me.</p>
            </div>
            <div className='flex items-center gap-3 mt-6'>
              <div className='w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-black'>A</div>
              <div>
                <p className='text-white text-sm font-bold'>Asym Alwali</p>
                <p className='text-zinc-500 text-xs'>19 · Yobe, Nigeria 🇳🇬 · Built on Android</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
