const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Remove the orphan closing fragment at line 819
// It's right after the aiResponse motion.div closes
c = c.replace(
  `                )}
              </>
            )}
          </div>`,
  `                )}
            )}
          </div>`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
