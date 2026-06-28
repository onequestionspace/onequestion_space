const fs = require('fs');
const c = `
  return (
    <DashboardLayout title="Space Studio" description="Changes go live instantly">
      <div className="max-w-2xl mx-auto lg:max-w-7xl">

        {/* Completion bar */}
        <div className="mb-4 rounded-2xl p-4 border border-white/8 bg-white/3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-black text-white">{score}% complete</span>
            </div>
            {spaceUrl && (
              <Link href={spaceUrl} target="_blank" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                <ExternalLink className="w-3 h-3" /> View live
              </Link>
            )}
          </div>
          <div className="w-full h-1 bg-white/8 rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: score + '%' }} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {completionChecks.map((c, i) => (
              <span key={i} className={"text-[10px] px-2 py-0.5 rounded-full border " + (c.done ? "border-green-500/20 bg-green-500/8 text-green-400" : "border-white/8 text-zinc-600")}>
                {c.done ? "✓ " : ""}{c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/8 mb-4 lg:hidden">
          <button onClick={() => setMode('edit')}
            className={"flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all " + (mode === 'edit' ? "bg-primary text-black" : "text-zinc-500 hover:text-white")}>
            <Code2 className="w-3.5 h-3.5" /> Edit
          </button>
          <button onClick={() => { setMode('preview'); setPreviewKey(k => k + 1); }}
            className={"flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-black transition-all " + (mode === 'preview' ? "bg-primary text-black" : "text-zinc-500 hover:text-white")}>
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>

        <div className="flex gap-6">
          {/* Edit Panel */}
          <div className={"w-full lg:w-[400px] shrink-0 space-y-3 " + (mode === 'preview' ? "hidden lg:block" : "")}>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={"flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shrink-0 " + (activeTab === tab.id ? "bg-primary text-black" : "text-zinc-500 hover:text-white bg-white/3 border border-white/8")}>
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl p-5 border border-white/8 bg-white/3">

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center text-xl font-black text-white shrink-0">
                      {profile.avatar
                        ? <Image src={profile.avatar} alt={profile.displayName || ''} width={56} height={56} className="w-full h-full object-cover" />
                        : profile.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{profile.displayName}</p>
                      <p className="text-xs text-zinc-500">@{profile.username}</p>
                      <Link href="/dashboard/settings" className="text-xs text-primary hover:text-primary/80 mt-0.5 block">Change photo →</Link>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Display Name</label>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputClass} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Bio <span className="text-zinc-600 font-normal">{bio.length}/160</span></label>
                    <textarea value={bio} onChange={e => setBio(e.target.value.slice(0, 160))} rows={3} className={inputClass} placeholder="One line that makes people want to ask you something" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">AI Welcome Message</label>
                    <input value={welcomeMessage} onChange={e => setWelcomeMessage(e.target.value)} className={inputClass} placeholder="Ask me anything — I reply fast." />
                    <p className="text-xs text-zinc-600 mt-1">First thing visitors see on your space</p>
                  </div>
                  {saveBtn({ displayName, bio, welcomeMessage })}
                </div>
              )}

              {activeTab === 'vibe' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-zinc-400 mb-1.5 block">Vibe Quote <span className="text-zinc-600 font-normal">{vibeQuote.length}/200</span></label>
                    <p className="text-xs text-zinc-600 mb-2">One sentence that shows your personality.</p>
                    <textarea value={vibeQuote} onChange={e => setVibeQuote(e.target.value.slice(0, 200))} rows={3} className={inputClass} placeholder="Building from a phone. Ask me anything." />
                  </div>
                  {vibeQuote && (
                    <div className="p-4 rounded-xl bg-primary/8 border border-primary/20">
                      <p className="text-xs text-primary mb-1 font-black">Preview</p>
                      <p className="text-sm text-white italic">&ldquo;{vibeQuote}&rdquo;</p>
                    </div>
                  )}
                  {saveBtn({ vibeQuote })}
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-zinc-400 mb-1">Your Links</p>
                    <p className="text-xs text-zinc-600 mb-3">Pin up to 5 links. Add a photo to make them pop.</p>
                  </div>
                  <div className="space-y-3">
                    {links.map((link, i) => (
                      <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input value={link.title} onChange={e => { const next = [...links]; next[i].title = e.target.value; setLinks(next); }} placeholder="Label" className={inputClass} />
                          <input value={link.url} onChange={e => { const next = [...links]; next[i].url = e.target.value; setLinks(next); }} placeholder="https://..." className={inputClass} />
                        </div>
                        <div className="flex items-center gap-2">
                          {link.image ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img src={link.image} alt="" className="w-full h-full object-cover" />
                              <button onClick={() => { const next = [...links]; next[i].image = ''; setLinks(next); }}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white text-xs">x</button>
                            </div>
                          ) : (
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-primary/40 transition-all text-xs cursor-pointer shrink-0">
                              + Photo
                              <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append('file', file);
                                try {
                                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  if (data.url) { const next = [...links]; next[i].image = data.url; setLinks(next); }
                                } catch {}
                              }} />
                            </label>
                          )}
                          <button onClick={() => setLinks(links.filter((_, j) => j !== i))} className="ml-auto p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {links.length < 5 && (
                    <button onClick={() => setLinks([...links, { title: '', url: '' }])}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/15 text-zinc-500 hover:text-white hover:border-primary/40 transition-all text-xs w-full justify-center">
                      <Plus className="w-3.5 h-3.5" /> Add Link
                    </button>
                  )}
                  {saveBtn({ links: JSON.stringify(links.filter(l => l.title || l.url)) })}
                </div>
              )}

              {activeTab === 'pinned' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-zinc-400 mb-1">Pinned Answers</p>
                    <p className="text-xs text-zinc-600 mb-3">Pick up to 3 best answers to showcase.</p>
                  </div>
                  {recentQuestions && recentQuestions.filter(q => q.isAnswered).length > 0 ? (
                    <div className="space-y-2">
                      {recentQuestions.filter(q => q.isAnswered).map(q => {
                        const isPinned = pinnedQuestions.includes(q._id);
                        return (
                          <div key={q._id}
                            className={"p-3 rounded-xl border transition-all cursor-pointer " + (isPinned ? "border-primary/40 bg-primary/8" : "border-white/8 hover:border-white/20 bg-white/3")}
                            onClick={() => {
                              if (isPinned) setPinnedQuestions(pinnedQuestions.filter(id => id !== q._id));
                              else if (pinnedQuestions.length < 3) setPinnedQuestions([...pinnedQuestions, q._id]);
                            }}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-black text-white line-clamp-1">{q.question}</p>
                                {q.answer && <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{q.answer}</p>}
                              </div>
                              <div className={"w-4 h-4 rounded-full border shrink-0 flex items-center justify-center " + (isPinned ? "border-primary bg-primary" : "border-white/20")}>
                                {isPinned && <Check className="w-2.5 h-2.5 text-black" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-600">
                      <Pin className="w-6 h-6 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No answered questions yet</p>
                      <p className="text-xs mt-1 text-zinc-700">Share your space to get questions</p>
                    </div>
                  )}
                  {pinnedQuestions.length > 0 && saveBtn({ pinnedQuestions })}
                </div>
              )}

              {activeTab === 'appearance' && <AppearanceTab />}
            </div>
          </div>
`;
fs.appendFileSync('app/dashboard/studio/page.tsx', c);
console.log('Part 2 done');
