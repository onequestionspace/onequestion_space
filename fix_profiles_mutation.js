const fs = require('fs');
let code = fs.readFileSync('convex/profiles.ts', 'utf8');

// Add new fields to mutation args
code = code.replace(
  `    socialLinks: v.optional(v.string()),`,
  `    socialLinks: v.optional(v.string()),
    vibeQuote: v.optional(v.string()),
    links: v.optional(v.string()),
    themeEffect: v.optional(v.string()),
    pinnedQuestions: v.optional(v.array(v.string())),`
);

// Add new fields to the patch
code = code.replace(
  `      ...(args.socialLinks !== undefined && { socialLinks: args.socialLinks }),`,
  `      ...(args.socialLinks !== undefined && { socialLinks: args.socialLinks }),
      ...(args.vibeQuote !== undefined && { vibeQuote: args.vibeQuote }),
      ...(args.links !== undefined && { links: args.links }),
      ...(args.themeEffect !== undefined && { themeEffect: args.themeEffect }),
      ...(args.pinnedQuestions !== undefined && { pinnedQuestions: args.pinnedQuestions }),`
);

fs.writeFileSync('convex/profiles.ts', code);
console.log('Done');
