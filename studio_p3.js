const fs = require('fs');
const c = `
          {/* Preview Panel */}
          <div className={"flex-1 min-w-0 " + (mode === 'edit' ? "hidden lg:block" : "")}>
            <div className="sticky top-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-zinc-400 font-black">Your space — live</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewKey(k => k + 1)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                  {spaceUrl && (
                    <Link href={spaceUrl} target="_blank"
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-lg hover:bg-primary/10">
                      <ExternalLink className="w-3 h-3" /> Open
                    </Link>
                  )}
                </div>
              </div>

              {spaceUrl ? (
                <div className="relative mx-auto" style={{ width: '320px' }}>
                  <div className="relative rounded-[2.5rem] border-[5px] border-zinc-700 overflow-hidden shadow-2xl" style={{ height: '640px', background: '#000' }}>
                    <div className="absolute top-0 left-0 right-0 h-7 bg-black z-10 flex items-center justify-between px-5">
                      <span className="text-[10px] text-white/50 font-mono">9:41</span>
                      <div className="w-20 h-4 bg-black rounded-full border border-zinc-800" />
                      <span className="text-[10px] text-white/50">●●●</span>
                    </div>
                    <iframe key={previewKey} src={spaceUrl} className="w-full h-full pt-7" title="Space Preview" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-zinc-600 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center" style={{ height: '500px' }}>
                  <div className="text-center text-zinc-600">
                    <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Complete onboarding first</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
`;
fs.appendFileSync('app/dashboard/studio/page.tsx', c);
console.log('Part 3 done');
