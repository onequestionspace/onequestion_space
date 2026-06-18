const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// Remove the broken GA scripts wherever they are
layout = layout.replace(/\s*\{\/\* Google Analytics \*\/\}[\s\S]*?<\/Script>/g, '');

// Insert correctly just before </body>
const gaScripts = `
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

// Insert before </ClerkProvider> closing so it's inside the JSX tree
layout = layout.replace('</ClerkProvider>', gaScripts + '\n      </ClerkProvider>');

fs.writeFileSync('app/layout.tsx', layout);
console.log('✓ GA scripts placed correctly inside JSX tree');
