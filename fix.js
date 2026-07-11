const fs = require('fs');
let c = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Remove the extra </div> that was left from the drawer removal
c = c.replace(
  `            ))}
          </div>

          {tab === 'founding'`,
  `            ))}
          </div>
        )}

        {tab === 'founding'`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', c);
console.log('done');
