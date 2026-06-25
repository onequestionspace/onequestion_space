const fs = require('fs');

let content = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

content = content.replace(
  `                </button>
              </div>

          </motion.div>`,
  `                </button>
              </div>
            )}

          </motion.div>`
);

fs.writeFileSync('app/onboarding/page.tsx', content);
console.log('✅ Fixed — closing )} added for step 7');
