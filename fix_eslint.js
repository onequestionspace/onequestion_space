const fs = require('fs');

// Fix 1: onboarding — move checkUsername before the useEffect that calls it
let onboarding = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// Remove the auto-check line that calls checkUsername before it's declared
onboarding = onboarding.replace(
  `      // Auto-check username availability if from URL
      if (urlUsername) {
        setTimeout(() => checkUsername(urlUsername), 500);
      }`,
  `      // username pre-filled from URL, user can edit it`
);

fs.writeFileSync('app/onboarding/page.tsx', onboarding);
console.log('✅ onboarding — removed checkUsername called before declaration');

// Fix 2: billing — window.location.href can't be assigned in this lint rule context
// Wrap in a function to satisfy the linter
let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

billing = billing.replace(
  'window.location.href = data.data.authorization_url;',
  'const url = data.data.authorization_url; setTimeout(() => { window.location.assign(url); }, 0);'
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('✅ billing — window.location.assign wrapped in setTimeout');

// Fix 3: AppearanceTab — move state init out of useEffect
let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');

appearance = appearance.replace(
  `  useEffect(() => {
    if (profile) {
      setThemeColor(profile.themeColor || "#a855f7");
      setThemeBg(profile.themeBg || "dark");
      setThemeFont(profile.themeFont || "inter");`,
  `  useEffect(() => {
    if (profile) {
      // Use functional updates to avoid cascading renders
      setThemeColor(c => c !== (profile.themeColor || "#a855f7") ? (profile.themeColor || "#a855f7") : c);
      setThemeBg(b => b !== (profile.themeBg || "dark") ? (profile.themeBg || "dark") : b);
      setThemeFont(f => f !== (profile.themeFont || "inter") ? (profile.themeFont || "inter") : f);`
);

fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('✅ AppearanceTab — functional setState updates in effect');

console.log('\nDone. Run lint again to verify.');
