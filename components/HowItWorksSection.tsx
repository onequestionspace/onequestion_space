const steps = [
  { number: '01', title: 'Upload your knowledge', description: 'Add your notes, answers, and the details people ask you for most.' },
  { number: '02', title: 'Get your link', description: 'Open your page, ask real questions, and check the answers against your sources before sharing.' },
  { number: '03', title: 'Share it anywhere', description: 'Put your link in your bio, email signature, or send it in a DM.' },
];

export function HowItWorksSection() {
  return (
    <section id="product" className="bg-white px-4 py-20 text-black sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-zinc-500">Product</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Your work, ready to answer.
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-7">
              <p className="text-xs font-medium tracking-wide text-zinc-500">{step.number}</p>
              <h3 className="mt-7 text-lg font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
