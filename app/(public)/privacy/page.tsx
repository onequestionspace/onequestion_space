import Link from 'next/link';

const sections = [
  {
    title: 'What we store',
    body: 'We store your account and profile details, the knowledge and files you choose to upload, embeddings used to find relevant information, questions and answers from your page, and basic usage and subscription records. Clerk handles sign-in. Paystack processes payments; OneQuestion does not store your full payment card details.',
  },
  {
    title: 'How your information is used',
    body: 'Your uploaded knowledge is used to find relevant context when someone asks a question on your public page. The question and relevant context are sent to our AI service provider to generate an answer. Questions, answers, and usage records are saved so your page can work and you can review its activity.',
  },
  {
    title: 'AI model training',
    body: 'We do not use your uploaded knowledge, questions, or answers to train AI models.',
  },
  {
    title: 'Who processes your data',
    body: 'OneQuestion relies on service providers for hosting and database storage, authentication, payment processing, and AI answer generation. They process information only as needed to provide those services.',
  },
  {
    title: 'Public pages and your choices',
    body: 'Your OneQuestion page is public. Visitors can submit questions, and the AI uses the knowledge you provide to answer them. Do not upload information you do not want used to answer visitors. You can remove knowledge items in your dashboard. To request access to or deletion of account data, contact hello@onequestion.space.',
  },
  {
    title: 'Contact',
    body: 'Questions about privacy or a data request? Email hello@onequestion.space.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-[70vh] bg-white px-4 pb-20 pt-28 text-black">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-zinc-500 hover:text-black">Back to OneQuestion</Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em]">Privacy policy</h1>
        <p className="mt-3 text-sm text-zinc-500">A plain-language explanation of what OneQuestion stores and how it is used.</p>

        <div className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
          {sections.map((section) => (
            <section key={section.title} className="py-6">
              <h2 className="text-base font-medium tracking-tight">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
