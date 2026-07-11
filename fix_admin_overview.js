const fs = require('fs');
let code = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Add siteAnalytics query
code = code.replace(
  `  const profiles = useQuery(api.admin.getAllProfilesWithStats, isAdmin ? { adminId } : 'skip');`,
  `  const profiles = useQuery(api.admin.getAllProfilesWithStats, isAdmin ? { adminId } : 'skip');
  const siteStats = useQuery(api.siteAnalytics.getSiteAnalytics, isAdmin ? { adminId } : 'skip');
  const [selectedUserId, setSelectedUserId] = useState('');
  const userActivity = useQuery(api.siteAnalytics.getUserActivity, isAdmin && selectedUserId ? { adminId, userId: selectedUserId } : 'skip');`
);

// Replace the overview tab content
code = code.replace(
  /\{tab === 'overview' && \([\s\S]*?\)\s*\}\s*\{tab === 'users'/,
  `{tab === 'overview' && (
          <div className="space-y-4">
            {/* Site Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-1">Total Pageviews</p>
                <p className="text-2xl font-black text-white">{siteStats?.totalPageviews ?? 0}</p>
                <p className="text-xs text-zinc-600 mt-1">Today: {siteStats?.todayViews ?? 0} · Week: {siteStats?.weekViews ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-1">Unique Visitors</p>
                <p className="text-2xl font-black text-white">{siteStats?.uniqueVisitors ?? 0}</p>
                <p className="text-xs text-zinc-600 mt-1">Month: {siteStats?.monthViews ?? 0} views</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-1">Total Spaces</p>
                <p className="text-2xl font-black text-white">{siteStats?.totalProfiles ?? 0}</p>
                <p className="text-xs text-zinc-600 mt-1">Today: +{siteStats?.newUsersToday ?? 0} · Week: +{siteStats?.newUsersWeek ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-1">Total Questions</p>
                <p className="text-2xl font-black text-white">{siteStats?.totalQuestions ?? 0}</p>
                <p className="text-xs text-zinc-600 mt-1">Today: {siteStats?.questionsToday ?? 0} · Week: {siteStats?.questionsWeek ?? 0}</p>
              </div>
            </div>

            {/* Daily Chart */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500 mb-3">Pageviews — Last 7 Days</p>
              <div className="flex items-end gap-2 h-20">
                {siteStats?.dailyViews?.map((d, i) => {
                  const max = Math.max(...(siteStats.dailyViews?.map(x => x.count) || [1]));
                  const pct = max > 0 ? (d.count / max) * 100 : 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full rounded-t-sm bg-amber-500/30 hover:bg-amber-500/50 transition-colors relative" style={{ height: Math.max(pct, 4) + '%' }}>
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-zinc-500">{d.count}</span>
                      </div>
                      <span className="text-[9px] text-zinc-600">{d.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Page breakdown */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="text-xs text-zinc-500 mb-3">Top Pages</p>
              <div className="space-y-2">
                {siteStats?.pageBreakdown?.slice(0, 8).map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-mono truncate flex-1">{p.page}</span>
                    <span className="text-amber-400 font-bold ml-2">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founders/Early stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-1">Founding Members</p>
                <p className="text-2xl font-black text-white">{founders?.length ?? 0}<span className="text-sm text-zinc-600">/5</span></p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500 mb-1">Early Adopters</p>
                <p className="text-2xl font-black text-white">{earlyAdopters?.length ?? 0}<span className="text-sm text-zinc-600">/50</span></p>
              </div>
            </div>
          </div>
        )}

        {tab === 'users'`
);

// Make user cards clickable to show activity
code = code.replace(
  `              <div key={p._id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-150 hover:bg-white/[0.05]">`,
  `              <div key={p._id} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-150 hover:bg-white/[0.05] cursor-pointer" onClick={() => setSelectedUserId(selectedUserId === p.userId ? '' : p.userId)}>`
);

// Add user activity drawer after the users list
code = code.replace(
  `          </div>
        )}

        {tab === 'founding'`,
  `          </div>

          {/* User Activity Drawer */}
          {selectedUserId && userActivity && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-white">User Activity</p>
                <button onClick={() => setSelectedUserId('')} className="text-xs text-zinc-500 hover:text-white">Close ×</button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-white font-bold text-lg">{userActivity.questions.length}</p>
                  <p className="text-zinc-500">Questions</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-white font-bold text-lg">{userActivity.knowledgeCount}</p>
                  <p className="text-zinc-500">Knowledge</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <p className="text-white font-bold text-lg">{userActivity.pageviewCount}</p>
                  <p className="text-zinc-500">Pageviews</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-2">Plan: <span className="text-amber-400 font-bold">{userActivity.subscription?.plan ?? 'free'}</span> · Credits: {userActivity.subscription?.messagesUsed ?? 0}/{userActivity.subscription?.messagesLimit ?? 50}</p>
              </div>
              {userActivity.questions.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 mb-2">Recent Questions</p>
                  <div className="space-y-2">
                    {userActivity.questions.slice(0, 5).map((q, i) => (
                      <div key={i} className="rounded-xl bg-white/5 p-3">
                        <p className="text-xs text-white line-clamp-1">{q.question}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">{new Date(q.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        )}

        {tab === 'founding'`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', code);
console.log('Done');
