const fs = require('fs');
let code = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

// Current broken structure:
// ))}          <- closes filteredProfiles.map
//              <- missing </div> for space-y-3
// {/* drawer */}
// ...drawer...
// </div>       <- closes drawer
// )}           <- closes drawer conditional  
// </div>       <- this is the space-y-3 close (wrong place)
// )}           <- closes users tab

// Fix: remove the misplaced </div> before )} and add it in right place
code = code.replace(
  `            </div>
          )}
          </div>
        )}

        {tab === 'founding'`,
  `            </div>
          )}
        )}

        {tab === 'founding'`
);

// Now add the space-y-3 closing div in the right place (after map closes)
code = code.replace(
  `            ))}

          {/* User Activity Drawer */}`,
  `            ))}
          </div>

          {/* User Activity Drawer */}`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', code);
console.log('Done');
