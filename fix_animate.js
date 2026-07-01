const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

c = c.replace(
  `                )}
            )}
          </div>

          {/* Always-visible input — like iMessage */}`,
  `                )}
            </AnimatePresence>
          </div>

          {/* Always-visible input — like iMessage */}`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
