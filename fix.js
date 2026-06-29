const fs = require('fs');
let c = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

// Remove duplicate FOUNDER_IDS line
const marker = "const FOUNDER_IDS = ['user_3EhKmuVyC1AhoBDlL7QNssllwgu', 'user_3Fmuk2jHEa5seXKEzewhWlA9yQs'];";
const first = c.indexOf(marker);
const second = c.indexOf(marker, first + 1);
if (second !== -1) {
  c = c.slice(0, second) + c.slice(second + marker.length + 1);
}

// Fix broken syntax on line with _PROD
c = c.replace(
  `{(FOUNDER_IDS.includes(profile.userId) || FOUNDER_IDS.includes(profile.userId)_PROD) && (`,
  `{FOUNDER_IDS.includes(profile.userId) && (`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', c);
console.log('done');
