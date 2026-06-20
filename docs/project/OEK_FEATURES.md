# One Question - OEK Feature Roadmap
**Version:** 0.2.0
**Last Updated:** June 10, 2026

## Feature 1 - Shareable AI Answer Cards
Priority: HIGHEST | Effort: Low | Impact: Viral + Revenue
- Free users get watermarked cards, paid get clean branded cards
- New file: app/api/card/route.ts (next/og ImageResponse)
- Modify: app/[username]/page.tsx - add Share button
- Every share links back to platform = free ads

## Feature 2 - Embeddable Question Widget
Priority: HIGH | Effort: Medium | Impact: Viral + Acquisition
- Copy-paste iframe snippet for any website or bio link
- New: app/api/widget/[username]/route.ts
- Modify: app/dashboard/settings/page.tsx

## Feature 3 - Waitlist Referral System
Priority: HIGH | Effort: Low | Impact: Acquisition
- Unique referral link, refer 3 friends to skip queue
- New: convex/waitlist.ts
- Modify: app/waitlist/page.tsx

## Feature 4 - AI Weekly Digest Email
Priority: MEDIUM | Effort: Medium | Impact: Retention + Revenue
- Weekly AI answer from knowledge base, daily for paid users
- New: convex/digest.ts, app/api/digest/route.ts
- Modify: app/dashboard/settings/page.tsx

## Feature 5 - Knowledge Base Auto-Import
Priority: MEDIUM | Effort: Medium | Impact: Activation
- Paste any URL, platform scrapes and indexes automatically
- New: app/api/knowledge/import/route.ts
- Modify: app/dashboard/knowledge/page.tsx

## Feature 6 - Question of the Day Public Feed
Priority: MEDIUM | Effort: Low | Impact: SEO + Acquisition
- Public /explore page with anonymized Q&A, pure SEO traffic
- New: app/explore/page.tsx, convex/explore.ts

## Priority
1. Shareable Cards   - Low effort  - Viral+Revenue - NOW
2. Referral Waitlist - Low effort  - Viral         - NOW
3. Embed Widget      - Med effort  - Viral+Revenue - NEXT
4. Public Feed       - Low effort  - SEO           - NEXT
5. Weekly Digest     - Med effort  - Retention     - AFTER
6. Auto-Import       - Med effort  - Activation    - AFTER
