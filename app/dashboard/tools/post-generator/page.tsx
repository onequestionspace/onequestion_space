"use client";

import { useState } from "react";

type Draft = { label: string; body: string };

export default function PostGeneratorPage() {
  const [mode, setMode] = useState<"manual" | "commits">("manual");
  const [work, setWork] = useState("");
  const [commits, setCommits] = useState("");
  const [metric, setMetric] = useState("");
  const [mood, setMood] = useState("grind");
  const [postType, setPostType] = useState<"single" | "thread">("single");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [thread, setThread] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    if (mode === "manual" && !work.trim()) {
      setError("Tell me what you worked on first.");
      return;
    }
    if (mode === "commits" && !commits.trim()) {
      setError("Paste your git log output first.");
      return;
    }

    setLoading(true);
    setDrafts([]);
    setThread([]);

    try {
      const res = await fetch("/api/tools/post-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, work, commits, metric, mood, postType }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();

      if (postType === "thread") {
        setThread(data.thread || []);
      } else {
        setDrafts(data.drafts || []);
      }
    } catch (err) {
      setError("Something went wrong generating drafts. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f2f2f2] px-4 py-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-1">
        🐣 Build in Public — Post Generator
      </h1>
      <p className="text-sm text-[#9a9a9a] mb-6">
        Turn today&rsquo;s work into ready-to-post drafts in your voice.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
            mode === "manual"
              ? "bg-orange-500 text-black border-orange-500"
              : "bg-[#17171a] text-[#ccc] border-[#2a2a2e]"
          }`}
        >
          Describe it
        </button>
        <button
          onClick={() => setMode("commits")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
            mode === "commits"
              ? "bg-orange-500 text-black border-orange-500"
              : "bg-[#17171a] text-[#ccc] border-[#2a2a2e]"
          }`}
        >
          Paste git log
        </button>
      </div>

      {mode === "manual" ? (
        <>
          <label className="block text-xs text-orange-500 uppercase tracking-wide mb-1 mt-2">
            What did you work on / ship / fix today?
          </label>
          <textarea
            value={work}
            onChange={(e) => setWork(e.target.value)}
            placeholder="e.g. Fixed the Convex listNeedsReview deploy issue breaking the Inbox page"
            className="w-full bg-[#17171a] border border-[#2a2a2e] rounded-lg p-3 text-sm min-h-[70px]"
          />
        </>
      ) : (
        <>
          <label className="block text-xs text-orange-500 uppercase tracking-wide mb-1 mt-2">
            Paste today&rsquo;s `git log --oneline` output
          </label>
          <textarea
            value={commits}
            onChange={(e) => setCommits(e.target.value)}
            placeholder={"e.g.\na1b2c3 fix: convex listNeedsReview not deployed\nd4e5f6 fix: inbox ghost stacking on android chrome"}
            className="w-full bg-[#17171a] border border-[#2a2a2e] rounded-lg p-3 text-sm min-h-[100px] font-mono"
          />
          <p className="text-xs text-[#6b6b6b] mt-1">
            AI will read your commit messages and turn them into a plain-English update.
          </p>
        </>
      )}

      <label className="block text-xs text-orange-500 uppercase tracking-wide mb-1 mt-4">
        Metric or result (optional)
      </label>
      <input
        type="text"
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
        placeholder="e.g. Inbox renders clean on Android Chrome now"
        className="w-full bg-[#17171a] border border-[#2a2a2e] rounded-lg p-3 text-sm"
      />

      <div className="flex gap-3 mt-4">
        <div className="flex-1">
          <label className="block text-xs text-orange-500 uppercase tracking-wide mb-1">
            Mood
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full bg-[#17171a] border border-[#2a2a2e] rounded-lg p-3 text-sm"
          >
            <option value="morning">Morning kickoff</option>
            <option value="grind">Mid-day grind</option>
            <option value="night">Night wrap-up</option>
            <option value="reflective">Reflective</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-orange-500 uppercase tracking-wide mb-1">
            Type
          </label>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value as "single" | "thread")}
            className="w-full bg-[#17171a] border border-[#2a2a2e] rounded-lg p-3 text-sm"
          >
            <option value="single">Single post</option>
            <option value="thread">Thread</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full mt-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold py-3 rounded-lg text-sm"
      >
        {loading ? "Generating..." : "Generate Drafts"}
      </button>

      {drafts.length > 0 && (
        <div className="mt-6 space-y-3">
          {drafts.map((d, i) => (
            <div key={i} className="bg-[#141416] border border-[#262629] rounded-xl p-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-orange-500 mb-2">
                {d.label}
              </div>
              <div className="text-sm whitespace-pre-wrap text-[#e8e8e8]">{d.body}</div>
              <button
                onClick={() => copyText(d.body, i)}
                className={`mt-3 text-xs border rounded-md px-3 py-1 ${
                  copiedIdx === i ? "border-green-500 text-green-500" : "border-[#3a3a3e] text-[#ccc]"
                }`}
              >
                {copiedIdx === i ? "Copied ✓" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {thread.length > 0 && (
        <div className="mt-6 bg-[#141416] border border-[#262629] rounded-xl p-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-orange-500 mb-3">
            Thread ({thread.length} tweets)
          </div>
          {thread.map((t, i) => (
            <div key={i} className="text-sm whitespace-pre-wrap text-[#e8e8e8] pb-3 mb-3 border-b border-[#262629] last:border-0">
              {t}
            </div>
          ))}
          <button
            onClick={() => copyText(thread.join("\n\n---\n\n"), 999)}
            className={`mt-1 text-xs border rounded-md px-3 py-1 ${
              copiedIdx === 999 ? "border-green-500 text-green-500" : "border-[#3a3a3e] text-[#ccc]"
            }`}
          >
            {copiedIdx === 999 ? "Copied ✓" : "Copy Full Thread"}
          </button>
        </div>
      )}
    </div>
  );
}
