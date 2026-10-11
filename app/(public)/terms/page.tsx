import Link from 'next/link';

const sections = [
  {
    title: 'Using OneQuestion',
    body: 'You must be at least 13 years old and provide accurate account information. Keep your sign-in details secure and use the service lawfully.',
  },
  {
    title: 'Your content',
    body: 'You keep ownership of the knowledge and files you upload. You give OneQuestion permission to store and process that content only to operate your page and generate answers. You are responsible for having the rights to upload and share it.',
  },
  {
    title: 'Public pages and AI answers',
    body: 'Your page is public and visitors can submit questions. AI answers are generated from the information you provide and may be incomplete or incorrect. Review your knowledge and do not rely on generated answers as professional, legal, financial, or medical advice.',
  },
  {
    title: 'Plans and billing',
    body: 'The Free plan includes up to 50 AI answers per month. Pro is $9 per month and includes up to 500 answers per month, analytics, and removal of OneQuestion branding. Paid plans are billed through our payment provider. Manage or cancel your subscription from the billing page.',
  },
  {
    title: 'Availability and changes',
    body: 'We work to keep OneQuestion available, but cannot guarantee uninterrupted service. We may update the service or these terms; material changes will be reflected on this page.',
  },
  {
    title: 'Contact',
    body: 'For help or questions about these terms, email hello@onequestion.space.',
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-[70vh] bg-white px-4 pb-20 pt-28 text-black">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-zinc-500 hover:text-black">Back to OneQuestion</Link>
        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em]">Terms of service</h1>
        <p className="mt-3 text-sm text-zinc-500">The basic terms for creating and sharing a OneQuestion page.</p>

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
