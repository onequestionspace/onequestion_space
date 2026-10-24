import Link from 'next/link';
import {
  Brain, BarChart3, Palette, Zap, Globe, ShieldCheck,
  MessageSquare, Upload, CheckCircle2, ArrowRight, Inbox, BookOpenText
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    eyebrow: 'Knowledge',
    title: 'Answers shaped by your context',
    desc: 'Add your bio, services, FAQs, project details, and other information you want visitors to know. Keep the source material current and test the questions people actually ask.',
    bullets: ['Text and supported file uploads', 'FAQs and service information', 'Owner-controlled knowledge'],
  },
  {
    icon: MessageSquare,
    eyebrow: 'Public page',
    title: 'One clear place to ask',
    desc: 'Give people a dedicated link for questions about your work instead of repeating the same explanation across DMs, email, and social profiles.',
    bullets: ['Shareable personal URL', 'Mobile-friendly visitor experience', 'Profile and welcome message'],
  },
  {
    icon: Inbox,
    eyebrow: 'Human oversight',
    title: 'See what needs your attention',
    desc: 'Use your inbox to review questions that need a better answer and add your own response when the AI context is not enough.',
    bullets: ['Review and unanswered questions', 'Write or correct replies', 'Improve knowledge over time'],
  },
  {
    icon: BarChart3,
    eyebrow: 'Insights',
    title: 'Learn what people care about',
    desc: 'Use the available dashboard metrics and question history to identify repeated questions and decide what information to add next.',
    bullets: ['Question and answer totals', 'Popular questions', 'Plan usage visibility'],
  },
  {
    icon: Palette,
    eyebrow: 'Personalization',
    title: 'Make the page feel like yours',
    desc: 'Shape your profile, welcome message, links, suggested questions, and available appearance settings so the page fits your work.',
    bullets: ['Profile and bio', 'Links and suggested questions', 'Appearance controls'],
  },
  {
    icon: Upload,
    eyebrow: 'Setup',
    title: 'Start with what you already know',
    desc: 'Build your first knowledge set from the information you already use to explain your work. Start small, test it, then add detail where visitors get stuck.',
    bullets: ['Start with a few FAQs', 'Add service and pricing details', 'Update information when it changes'],
  },
];

const STEPS = [
  { number: '01', title: 'Build your context', text: 'Add a useful bio and the information visitors need most.' },
  { number: '02', title: 'Test real questions', text: 'Try common questions yourself and improve unclear answers.' },
  { number: '03', title: 'Share your link', text: 'Put your page in your bio, portfolio, newsletter, or email signature.' },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
      <section className="border-b border-zinc-200 px-4 pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Product overview</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl">
            Your work deserves better than the same answer, over and over.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            OneQuestion is a shareable Q&A page for professionals, creators, educators, and small teams. Give visitors a useful place to ask about your work, powered by the knowledge you choose to provide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
              Create your page <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing" className="inline-flex h-11 items-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-800 hover:bg-zinc-100">
              View pricing
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-700" />You control the knowledge you add</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-700" />Visitors can use a shareable link</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-700" />Human review when AI needs help</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">What you can do</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Useful tools, connected to one workflow.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">The product is most valuable when your knowledge, public page, inbox, and usage insights work together.</p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, eyebrow, title, desc, bullets }) => (
              <article key={title} className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800"><Icon className="h-5 w-5" /></div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{eyebrow}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{desc}</p>
                <ul className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                  {bullets.map((bullet) => <li key={bullet} className="flex gap-2 text-xs leading-5 text-zinc-600"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">A simple path to value</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">From blank page to useful link.</h2>
          </div>
          <ol className="mt-9 grid gap-3 sm:grid-cols-3">
            {STEPS.map((step) => <li key={step.number} className="rounded-xl border border-zinc-200 p-5"><p className="text-xs font-semibold text-zinc-400">{step.number}</p><h3 className="mt-5 font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-600">{step.text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-2xl bg-zinc-950 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Start small</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Build a page people can actually use.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-300">Start with your most common questions, test the answers, and improve it as you learn what visitors need.</p>
          </div>
          <Link href="/sign-up" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-zinc-950 hover:bg-zinc-100">Create a free page <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
