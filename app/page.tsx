import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-bold">
              OQ
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Stop answering the same question twice.
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Create your AI-powered Q-Page. Upload your knowledge once and let AI
            answer visitors instantly.
          </p>

          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 rounded-xl bg-black text-white">
              Create Your Space
            </button>

            <button className="px-6 py-3 rounded-xl border">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How One Question Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="p-6 border rounded-2xl">
            <h3 className="font-bold mb-2">1. Create</h3>
            <p>Create your personal Q-Page.</p>
          </div>

          <div className="p-6 border rounded-2xl">
            <h3 className="font-bold mb-2">2. Upload</h3>
            <p>Add documents, links and knowledge.</p>
          </div>

          <div className="p-6 border rounded-2xl">
            <h3 className="font-bold mb-2">3. Share</h3>
            <p>Share one simple link.</p>
          </div>

          <div className="p-6 border rounded-2xl">
            <h3 className="font-bold mb-2">4. Answer</h3>
            <p>AI answers visitors automatically.</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet The Team
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl text-center">
              <div className="h-20 w-20 rounded-full bg-black mx-auto mb-4" />
              <h3 className="font-bold">@Asym_Alwali</h3>
              <p className="text-gray-500">Founder & CEO</p>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <div className="h-20 w-20 rounded-full bg-black mx-auto mb-4 flex items-center justify-center text-white">
                OQ
              </div>
              <h3 className="font-bold">One Question</h3>
              <p className="text-gray-500">AI Knowledge Platform</p>
            </div>

            <div className="bg-white p-6 rounded-2xl text-center">
              <div className="h-20 w-20 rounded-full bg-black mx-auto mb-4" />
              <h3 className="font-bold">Paraja</h3>
              <p className="text-gray-500">
                Founding Product Lead & Operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 px-6">
        <h2 className="text-4xl font-bold mb-4">
          Your knowledge. Your answers. Your space.
        </h2>

        <p className="text-gray-600 mb-8">
          Launch your AI-powered Q-Page today.
        </p>

        <button className="px-8 py-4 rounded-xl bg-black text-white">
          Get Started
        </button>
      </section>
    </main>
  );
}
