const fs = require('fs');

let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');

// Replace the useEffect with eslint-disable comment
appearance = appearance.replace(
  `  useEffect(() => {
    if (profile) {
      // Use functional updates to avoid cascading renders
      setThemeColor(c => c !== (profile.themeColor || "#a855f7") ? (profile.themeColor || "#a855f7") : c);
      setThemeBg(b => b !== (profile.themeBg || "dark") ? (profile.themeBg || "dark") : b);
      setThemeFont(f => f !== (profile.themeFont || "inter") ? (profile.themeFont || "inter") : f);
      setThemeCardStyle(profile.themeCardStyle || "glass");`,
  `  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (profile) {
      setThemeColor(profile.themeColor || "#a855f7");
      setThemeBg(profile.themeBg || "dark");
      setThemeFont(profile.themeFont || "inter");
      setThemeCardStyle(profile.themeCardStyle || "glass");`
);

fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('✅ AppearanceTab — eslint-disable added for server sync effect');
