import Link from 'next/link';
import { ArrowRight, BookOpen, MessageCircleQuestion, Share2, UserRound } from 'lucide-react';

const steps = [
  { number: '01', icon: UserRound, title: 'Tell it about your work', description: 'Introduce yourself in plain language. No prompts, code, or technical setup required.' },
  { number: '02', icon: BookOpen, title: 'Add the useful details', description: 'Start with services, prices, project examples, and the questions people ask you most.' },
  { number: '03', icon: MessageCircleQuestion, title: 'Test before you share', description: 'Ask the questions your customers actually ask. Check answers and improve anything that is missing or unclear.' },
  { number: '04', icon: Share2, title: 'Share one simple link', description: 'Put your page in your bio, portfolio, email signature, or send it directly to someone. Use the questions you receive to improve it.' },
];

export function HowItWorksSection() {
  return (
    <section id="product" className="bg-white px-4 py-20 text-black sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-zinc-500">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
              From what you know to one useful link.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
              Start with your own words. Improve the answers as you learn what people need. You do not need to know how AI works to use OneQuestion.
            </p>
          </div>
          <Link href="/sign-up" className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 sm:self-auto">
            Build your page <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <li key={number} className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wide text-zinc-400">{number}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700"><Icon className="h-4 w-4" /></span>
              </div>
              <h3 className="mt-6 text-base font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
