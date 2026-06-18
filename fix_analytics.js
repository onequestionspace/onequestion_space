const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// Add Script import if not already there
if (!layout.includes("next/script")) {
  layout = layout.replace(
    "import",
    "import Script from 'next/script';\nimport"
  );
}

// Remove old GA if already added
layout = layout.replace(/\s*\{\/\* Google Analytics \*\/\}[\s\S]*?<\/Script>/g, '');

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

layout = layout.replace('</body>', gaScripts + '\n    </body>');

fs.writeFileSync('app/layout.tsx', layout);
console.log('✓ Google Analytics G-Z0LXJWVJL9 added');
