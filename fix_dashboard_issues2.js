const fs = require('fs');

// 1. Add DashboardAI to layout manually
let layout = fs.readFileSync('components/DashboardLayout.tsx', 'utf8');

if (!layout.includes('DashboardAI')) {
  layout = layout.replace(
    "'use client';",
    "'use client';\nimport { DashboardAI } from './DashboardAI';"
  );
  layout = layout.replace(
    "      {/* Overlay */}",
    "      <DashboardAI />\n\n      {/* Overlay */}"
  );
  fs.writeFileSync('components/DashboardLayout.tsx', layout);
  console.log('1 DashboardAI added to layout');
} else {
  console.log('1 DashboardAI already in layout');
}

// 2. Fix dashboard glitch — remove knowledgeItems heavy query, use count only
let dashboard = fs.readFileSync('app/dashboard/page.tsx', 'utf8');
dashboard = dashboard.replace(
  "  const knowledgeItems = useQuery(\n    api.knowledge.getKnowledgeByUserId,\n    userId ? { userId } : 'skip'\n  );\n\n  const knowledgeCount = useQuery(",
  "  const knowledgeCount = useQuery("
);

// Replace knowledgeItems section with simple count display
dashboard = dashboard.replace(
  `          {/* Knowledge Base */}
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-semibold text-foreground flex items-center gap-2'><BookOpen className='w-4 h-4 text-primary' /> Knowledge Base</h2>
              <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline flex items-center gap-1'>Manage <ChevronRight className='w-3 h-3' /></Link>
            </div>
            {knowledgeItems && knowledgeItems.length > 0 ? (
              <div className='space-y-3'>
                {knowledgeItems.slice(0, 5).map((k) => (
                  <div key={k._id} className='p-4 rounded-xl bg-card border border-border'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='min-w-0'>
                        <p className='text-foreground text-sm font-medium line-clamp-1'>{k.title}</p>
                        <p className='text-muted-foreground text-xs line-clamp-2 mt-0.5'>{k.content}</p>
                      </div>
                      <div className='shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                        <Brain className='w-3.5 h-3.5 text-primary' />
                      </div>
                    </div>
                    <p className='text-xs text-muted-foreground/50 flex items-center gap-1 mt-2'><Clock className='w-3 h-3' />{new Date(k.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {knowledgeItems.length > 5 && (
                  <Link href='/dashboard/knowledge' className='block text-center text-xs text-primary hover:underline py-2'>
                    +{knowledgeItems.length - 5} more items
                  </Link>
                )}
              </div>
            ) : (
              <div className='text-center py-10'>
                <Brain className='w-10 h-10 text-muted-foreground/20 mx-auto mb-3' />
                <p className='text-sm text-muted-foreground'>No knowledge uploaded yet</p>
                <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline mt-1 block'>Upload your first item</Link>
              </div>
            )}
          </div>`,
  `          {/* Knowledge Base */}
          <div className='glass-card rounded-2xl p-6 border border-border'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='font-semibold text-foreground flex items-center gap-2'><BookOpen className='w-4 h-4 text-primary' /> Knowledge Base</h2>
              <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline flex items-center gap-1'>Manage <ChevronRight className='w-3 h-3' /></Link>
            </div>
            {knowledgeCount && knowledgeCount > 0 ? (
              <div className='text-center py-6'>
                <div className='w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3'>
                  <Brain className='w-7 h-7 text-primary' />
                </div>
                <p className='text-3xl font-bold text-foreground mb-1'>{knowledgeCount}</p>
                <p className='text-sm text-muted-foreground mb-4'>knowledge items uploaded</p>
                <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline'>View and manage all items</Link>
              </div>
            ) : (
              <div className='text-center py-10'>
                <Brain className='w-10 h-10 text-muted-foreground/20 mx-auto mb-3' />
                <p className='text-sm text-muted-foreground'>No knowledge uploaded yet</p>
                <Link href='/dashboard/knowledge' className='text-xs text-primary hover:underline mt-1 block'>Upload your first item</Link>
              </div>
            )}
          </div>`
);

fs.writeFileSync('app/dashboard/page.tsx', dashboard);
console.log('2 dashboard glitch fixed');
