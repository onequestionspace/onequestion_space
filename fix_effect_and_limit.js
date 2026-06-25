const fs = require('fs');

// Fix 1: AppearanceTab — read themeEffect from correct field
let appearance = fs.readFileSync('components/AppearanceTab.tsx', 'utf8');

appearance = appearance.replace(
  `setThemeEffect(profile.themeBg && ["particles","bubbles","net","matrix"].includes(profile.themeBg) ? profile.themeBg : "none");`,
  `setThemeEffect((profile as Record<string, unknown>).themeEffect as string || "none");`
);

fs.writeFileSync('components/AppearanceTab.tsx', appearance);
console.log('✅ AppearanceTab — themeEffect reads from correct field');

// Fix 2: Ask route — add usage limit check
let ask = fs.readFileSync('app/api/ask/route.ts', 'utf8');

// Add limit check after profile fetch
ask = ask.replace(
  `    // 2. Fetch all knowledge chunks for this user`,
  `    // 1b. Check subscription limit
    const subscription = await convex.query(api.subscriptions.getSubscription, { userId: profile.userId });
    if (subscription) {
      const used = subscription.messagesUsed ?? 0;
      const limit = subscription.messagesLimit ?? 50;
      if (used >= limit) {
        return NextResponse.json({
          success: false,
          error: 'Monthly AI answer limit reached. Upgrade your plan to continue.',
          limitReached: true,
        }, { status: 429 });
      }
    }

    // 2. Fetch all knowledge chunks for this user`
);

fs.writeFileSync('app/api/ask/route.ts', ask);
console.log('✅ Ask route — usage limit check added');

console.log('\nDone. Build and push.');
