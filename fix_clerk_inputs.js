const fs = require('fs');

// Fix 1: Add global CSS to kill browser autofill white background on Clerk inputs
let css = fs.readFileSync('app/globals.css', 'utf8');

const clerkFix = `
/* Fix Clerk input autofill white background */
.cl-formFieldInput:-webkit-autofill,
.cl-formFieldInput:-webkit-autofill:hover,
.cl-formFieldInput:-webkit-autofill:focus,
.cl-formFieldInput:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 100px rgba(255,255,255,0.06) inset !important;
  -webkit-text-fill-color: #ffffff !important;
  caret-color: #ffffff !important;
  border-color: rgba(147,51,234,0.4) !important;
  transition: background-color 9999s ease-in-out 0s !important;
}

.cl-formFieldInput:focus {
  background-color: rgba(255,255,255,0.08) !important;
  color: #ffffff !important;
}

/* Fix Clerk logo black background */
.cl-logoImage,
.cl-logoBox img {
  border-radius: 12px !important;
}

.cl-logoBox {
  background: transparent !important;
}

.cl-card {
  background: transparent !important;
}
`;

if (!css.includes('cl-formFieldInput:-webkit-autofill')) {
  css = css + clerkFix;
  fs.writeFileSync('app/globals.css', css);
  console.log('✅ globals.css — Clerk autofill fix + logo background fix');
} else {
  console.log('⚠️  Already has Clerk fix');
}

// Fix 2: Update Clerk variables to explicitly set input background on focus
const fixInput = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    "colorInputBackground: 'rgba(255,255,255,0.06)',",
    "colorInputBackground: 'rgba(255,255,255,0.06)',\n    colorInputText: '#ffffff',\n    colorNeutral: '#ffffff',"
  );
  // Make sure colorNeutral isn't duplicated
  content = content.replace(
    "colorInputText: '#ffffff',\n    colorNeutral: '#ffffff',\n    colorInputText: '#ffffff',",
    "colorInputText: '#ffffff',\n    colorNeutral: '#ffffff',"
  );
  fs.writeFileSync(filePath, content);
};

fixInput('app/sign-up/[[...sign-up]]/page.tsx');
console.log('✅ SignUp — colorNeutral added');

fixInput('app/sign-in/[[...sign-in]]/page.tsx');
console.log('✅ SignIn — colorNeutral added');

console.log('\nDone. Build and push.');
