const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

c = c.replace(
  `                )}
            </AnimatePresence>
          </div>`,
  `                )}
              </motion.div>
            )}
          </AnimatePresence>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
