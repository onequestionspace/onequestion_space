const fs = require('fs');

// 1. Update schema
let schema = fs.readFileSync('convex/schema.ts', 'utf8');
schema = schema.replace(
  '    welcomeMessage: v.optional(v.string()),\n    createdAt: v.number(),',
  '    welcomeMessage: v.optional(v.string()),\n    themeColor: v.optional(v.string()),\n    themeBg: v.optional(v.string()),\n    themeFont: v.optional(v.string()),\n    themeCardStyle: v.optional(v.string()),\n    socialLinks: v.optional(v.string()),\n    createdAt: v.number(),'
);
fs.writeFileSync('convex/schema.ts', schema);
console.log('1 schema done');

// 2. Update profiles mutation args
let profiles = fs.readFileSync('convex/profiles.ts', 'utf8');
profiles = profiles.replace(
  '    welcomeMessage: v.optional(v.string()),\n  },',
  '    welcomeMessage: v.optional(v.string()),\n    themeColor: v.optional(v.string()),\n    themeBg: v.optional(v.string()),\n    themeFont: v.optional(v.string()),\n    themeCardStyle: v.optional(v.string()),\n    socialLinks: v.optional(v.string()),\n  },'
);
profiles = profiles.replace(
  '      ...(args.welcomeMessage !== undefined && { welcomeMessage: args.welcomeMessage }),',
  '      ...(args.welcomeMessage !== undefined && { welcomeMessage: args.welcomeMessage }),\n      ...(args.themeColor !== undefined && { themeColor: args.themeColor }),\n      ...(args.themeBg !== undefined && { themeBg: args.themeBg }),\n      ...(args.themeFont !== undefined && { themeFont: args.themeFont }),\n      ...(args.themeCardStyle !== undefined && { themeCardStyle: args.themeCardStyle }),\n      ...(args.socialLinks !== undefined && { socialLinks: args.socialLinks }),'
);
fs.writeFileSync('convex/profiles.ts', profiles);
console.log('2 profiles done');

console.log('Run next scripts for components');
