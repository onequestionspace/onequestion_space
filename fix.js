const fs = require('fs');
let c = fs.readFileSync('app/dashboard/analytics/page.tsx', 'utf8');

// Check if getVisitorEmails is already imported
if (!c.includes('getVisitorEmails')) {
  // Add query after existing queries
  c = c.replace(
    `  const questions = useQuery(`,
    `  const visitorEmails = useQuery(api.questions.getVisitorEmails, profile?._id ? { profileId: profile._id } : 'skip');
  const questions = useQuery(`
  );

  // Add emails section before closing of main content
  c = c.replace(
    `      </div>\n    </DashboardLayout>`,
    `      {/* Visitor Emails */}
      {visitorEmails && visitorEmails.length > 0 && (
        <div className='glass-card rounded-2xl p-6 border border-border mt-6'>
          <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
            <span>📧</span> Visitor Emails
            <span className='ml-auto text-xs text-muted-foreground'>{visitorEmails.length} collected</span>
          </h3>
          <div className='space-y-2'>
            {visitorEmails.map((email, i) => (
              <div key={i} className='flex items-center justify-between px-3 py-2 rounded-xl bg-card border border-border'>
                <span className='text-sm text-foreground'>{email}</span>
                <button onClick={() => navigator.clipboard.writeText(email)} className='text-xs text-amber-500 hover:opacity-70'>Copy</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(visitorEmails.join('\\n'))}
            className='mt-4 w-full py-2 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground transition-colors'>
            Copy all emails
          </button>
        </div>
      )}
      </div>
    </DashboardLayout>`
  );
}

fs.writeFileSync('app/dashboard/analytics/page.tsx', c);
console.log('done');
