const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

// Find everything from <ClerkProvider to end and replace it clean
const clerkStart = layout.indexOf('<ClerkProvider');
const beforeClerk = layout.substring(0, clerkStart);

const freshEnd = `<ClerkProvider
        appearance={{
          variables: {
            colorBackground: '#0f0f0f',
            colorPrimary: '#9333ea',
            colorText: '#ffffff',
            colorTextSecondary: '#a1a1aa',
            colorInputBackground: 'rgba(255,255,255,0.06)',
            colorInputText: '#ffffff',
          },
        }}
      >
        <ConvexClientProvider>
          <div className="flex flex-col min-h-screen mesh-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ConvexClientProvider>
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
        </Script>
      </ClerkProvider>
    </body>
    </html>
  );
}`;

layout = beforeClerk + freshEnd;
fs.writeFileSync('app/layout.tsx', layout);
console.log('✓ Layout rewritten cleanly');
console.log(layout.split('\n').slice(-30).join('\n'));
