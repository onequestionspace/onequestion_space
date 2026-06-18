const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// Remove all existing GA blocks
layout = layout.replace(/\s*\{\/\* Google Analytics \*\/\}[\s\S]*?<\/Script>/g, '');

// Remove any double closing tags left behind
layout = layout.replace(/\s*<\/ClerkProvider>\s*<\/ClerkProvider>/g, '\n      </ClerkProvider>');

// Now insert GA correctly just before </ClerkProvider>
const ga = `
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z0LXJWVJL9"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {\`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z0LXJWVJL9');
        \`}
      </Script>`;

layout = layout.replace('</ClerkProvider>', ga + '\n      </ClerkProvider>');

fs.writeFileSync('app/layout.tsx', layout);
console.log('✓ Layout fixed');
console.log('--- tail check ---');
console.log(layout.split('\n').slice(-25).join('\n'));
