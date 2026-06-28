const fs = require('fs');
const content = `export default {
  providers: [
    {
      domain: "https://clerk.onequestion.space",
      applicationID: "convex",
    },
  ],
};
`;
fs.writeFileSync('convex/auth.config.ts', content);
console.log('done');
