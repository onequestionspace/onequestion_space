const fs = require('fs');
let content = fs.readFileSync('convex/profiles.ts', 'utf8');

content = content.replace(
  'export const createIfMissing = mutation({\n  args: {},',
  'export const createIfMissing = mutation({\n  args: { username: v.optional(v.string()) },'
);

content = content.replace(
  `username:
          identity.nickname ||
          identity.email?.split("@")[0] ||
          \`user_\${identity.subject.slice(0, 8)}\`,`,
  `username:
          args.username ||
          identity.nickname ||
          identity.email?.split("@")[0] ||
          \`user_\${identity.subject.slice(0, 8)}\`,`
);

fs.writeFileSync('convex/profiles.ts', content);
console.log('Done');
