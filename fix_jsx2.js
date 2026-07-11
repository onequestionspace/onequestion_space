const fs = require('fs');
let code = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// The problem: </div> closes the space-y-3 div, then activity drawer is outside the tab's )}
// We need to move the closing </div> and )} to AFTER the activity drawer

code = code.replace(
  `            ))}
          </div>

          {/* User Activity Drawer */}`,
  `            ))}

          {/* User Activity Drawer */}`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', code);
console.log('Done');
