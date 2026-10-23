import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { QueryCtx } from './_generated/server';

async function assertOwner(ctx: QueryCtx, userId: string) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || identity.subject !== userId) throw new Error('Not authorized to access this knowledge');
}

export const getKnowledgeHealth = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const profile = await ctx.db.query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    if (items.length === 0) {
      return { score: 0, freshness: 0, completeness: 0, coverage: 0, items: 0, details: [] };
    }

    const now = Date.now();
    const DAY = 86400000;

    // Freshness score (0-100)
    const freshnessScores = items.map(item => {
      const age = now - item.updatedAt;
      if (age < 7 * DAY) return 100;
      if (age < 30 * DAY) return 80;
      if (age < 90 * DAY) return 50;
      if (age < 180 * DAY) return 25;
      return 10;
    });
    const freshness = Math.round(freshnessScores.reduce((a, b) => a + b, 0) / freshnessScores.length);

    // Completeness: check if profile has key fields filled
    const completenessChecks = [
      { label: 'Display Name', met: !!(profile?.displayName && profile.displayName.length > 0), weight: 10 },
      { label: 'Bio', met: !!(profile?.bio && profile.bio.length > 30), weight: 15 },
      { label: 'Avatar', met: !!profile?.avatar, weight: 10 },
      { label: 'Welcome Message', met: !!(profile?.welcomeMessage && profile.welcomeMessage.length > 10), weight: 10 },
      { label: 'Suggested Questions', met: !!(profile?.suggestedQuestions && profile.suggestedQuestions.length > 0), weight: 10 },
      { label: 'Links', met: !!(profile?.links && profile.links.length > 5), weight: 10 },
      { label: 'Social Links', met: !!(profile?.socialLinks && profile.socialLinks.length > 3), weight: 5 },
      { label: 'Theme Customized', met: !!(profile?.themeColor || profile?.themeBg), weight: 5 },
    ];
    const completenessScore = completenessChecks.filter(c => c.met).reduce((sum, c) => sum + c.weight, 0);

    // Coverage: check knowledge diversity by sourceType
    const types = new Set(items.map(i => i.sourceType || 'personal'));
    const typeCoverage = Math.min(types.size / 3 * 100, 100);

    // Content quality: average content length
    const avgLen = items.reduce((sum, i) => sum + i.content.length, 0) / items.length;
    const qualityScore = Math.min(Math.round(avgLen / 50), 100);

    const details = completenessChecks.map(c => ({
      label: c.label,
      met: c.met,
      weight: c.weight,
    }));

    const score = Math.round((freshness * 0.25) + (completenessScore * 0.35) + (typeCoverage * 0.2) + (qualityScore * 0.2));

    return {
      score: Math.min(score, 100),
      freshness,
      completeness: completenessScore,
      coverage: Math.round(typeCoverage),
      quality: qualityScore,
      items: items.length,
      details,
    };
  },
});


const GAP_CATEGORIES = [
  { id: 'bio', category: 'About', severity: 'high' as const, keywords: ['i am', "i'm", 'my name', 'based in', 'from'], suggestion: 'Upload a personal bio or background document so your AI knows who you are.' },
  { id: 'pricing', category: 'Pricing', severity: 'high' as const, keywords: ['pricing', 'price', 'cost', 'plan', 'pay', 'subscription', 'per month', 'per hour'], suggestion: 'Add a document describing your pricing, plans, or rates so visitors know what things cost.' },
  { id: 'contact', category: 'Contact', severity: 'high' as const, keywords: ['email', 'contact', 'reach', 'dm', 'twitter', 'x.com', 'linkedin', 'calendly'], suggestion: 'Add contact details so visitors know how to reach you (email, social, calendar link).' },
  { id: 'services', category: 'Services', severity: 'medium' as const, keywords: ['service', 'offer', 'consulting', 'coaching', 'freelance', 'build', 'develop'], suggestion: 'Describe what services, products, or work you do to help visitors understand your value.' },
  { id: 'experience', category: 'Experience', severity: 'medium' as const, keywords: ['experience', 'work', 'built', 'created', 'project', 'client', 'company'], suggestion: 'Add a document describing past work, projects, or experience.' },
  { id: 'faq', category: 'FAQ', severity: 'medium' as const, keywords: ['faq', 'frequently asked', 'what is', 'how do', 'can you'], suggestion: 'Create an FAQ document with common questions you receive.' },
  { id: 'testimonials', category: 'Testimonials', severity: 'low' as const, keywords: ['testimonial', 'review', 'client said', 'customer', 'feedback'], suggestion: 'Add testimonials from clients or partners to build trust with visitors.' },
  { id: 'skills', category: 'Skills', severity: 'low' as const, keywords: ['skill', 'expertise', 'proficient', 'know', 'technology', 'tool', 'language'], suggestion: 'Describe your skills, tools, and areas of expertise.' },
];

export const getKnowledgeGaps = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const allContent = items.map(i => i.content.toLowerCase() + ' ' + i.title.toLowerCase()).join(' ');

    const gaps: { category: string; severity: 'low' | 'medium' | 'high'; description: string; suggestion: string }[] = [];

    for (const cat of GAP_CATEGORIES) {
      const covered = cat.keywords.some(kw => allContent.includes(kw));
      if (!covered) {
        gaps.push({
          category: cat.category,
          severity: cat.severity,
          description: `No ${cat.category.toLowerCase()} content found`,
          suggestion: cat.suggestion,
        });
      }
    }

    if (items.length < 5) {
      gaps.push({ category: 'Quantity', severity: 'medium', description: `Only ${items.length} knowledge item(s) — aim for 5+`, suggestion: 'Upload more content to give your AI a broader knowledge base to draw from.' });
    }

    return { gaps, total: gaps.length };
  },
});

export const getCoverageScore = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const allContent = items.map(i => i.content.toLowerCase()).join(' ');

    const CATEGORIES = [
      { id: 'bio', label: 'Bio / About', keywords: ['i am a', 'my name is', 'based in', 'i grew up', 'my background'], minMatches: 2 },
      { id: 'pricing', label: 'Pricing', keywords: ['pricing', 'per month', 'per hour', 'free plan', 'subscription', '$'], minMatches: 2 },
      { id: 'contact', label: 'Contact', keywords: ['reach out', 'send an email', 'dm me', 'contact me', 'get in touch'], minMatches: 1 },
      { id: 'services', label: 'Services', keywords: ['i offer', 'consulting', 'coaching', 'freelance', 'i build', 'i develop'], minMatches: 2 },
      { id: 'experience', label: 'Experience', keywords: ['years of experience', 'previously worked', 'i have built', 'case study', 'past project'], minMatches: 2 },
      { id: 'faq', label: 'FAQ', keywords: ['faq', 'frequently asked', 'q:', 'a:'], minMatches: 2 },
      { id: 'testimonials', label: 'Testimonials', keywords: ['testimonial', 'client said', 'customer said', '"i used', '"working with', 'review from'], minMatches: 2 },
      { id: 'skills', label: 'Skills', keywords: ['my skills', 'i am proficient', 'my tech stack', 'technologies i use', 'tools i use'], minMatches: 2 },
    ];

    const covered = CATEGORIES.map(cat => {
      const matchCount = cat.keywords.filter(kw => allContent.includes(kw)).length;
      const detected = matchCount >= (cat.minMatches ?? 1);
      return { ...cat, covered: detected };
    });

    const count = covered.filter(c => c.covered).length;
    const total = CATEGORIES.length;
    const score = total > 0 ? Math.round((count / total) * 100) : 0;

    return { score, covered, totalCovered: count, totalCategories: total };
  },
});

export const analyzeKnowledge = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    await assertOwner(ctx, args.userId);
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const profile = await ctx.db.query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    const now = Date.now();
    const DAY = 86400000;

    const freshnessScores = items.map(item => {
      const age = now - item.updatedAt;
      if (age < 7 * DAY) return 100;
      if (age < 30 * DAY) return 80;
      if (age < 90 * DAY) return 50;
      if (age < 180 * DAY) return 25;
      return 10;
    });
    const freshness = freshnessScores.length > 0 ? Math.round(freshnessScores.reduce((a, b) => a + b, 0) / freshnessScores.length) : 0;

    const completenessChecks = [
      { label: 'Display Name', met: !!(profile?.displayName && profile.displayName.length > 0) },
      { label: 'Bio', met: !!(profile?.bio && profile.bio.length > 30) },
      { label: 'Avatar', met: !!profile?.avatar },
      { label: 'Welcome Message', met: !!(profile?.welcomeMessage && profile.welcomeMessage.length > 10) },
      { label: 'Suggested Questions', met: !!(profile?.suggestedQuestions && profile.suggestedQuestions.length > 0) },
      { label: 'Links', met: !!(profile?.links && profile.links.length > 5) },
      { label: 'Social Links', met: !!(profile?.socialLinks && profile.socialLinks.length > 3) },
    ];
    const completenessScore = completenessChecks.filter(c => c.met).length * 14;

    const types = new Set(items.map(i => i.sourceType || 'personal'));
    const coverage = Math.min(types.size / 3 * 100, 100);

    const avgLen = items.length > 0 ? items.reduce((sum, i) => sum + i.content.length, 0) / items.length : 0;
    const qualityScore = Math.min(Math.round(avgLen / 50), 100);

    const score = items.length > 0 ? Math.round((freshness * 0.25) + (completenessScore * 0.35) + (coverage * 0.2) + (qualityScore * 0.2)) : 0;

    const allContent = items.map(i => i.content.toLowerCase()).join(' ');
    const allTitles = items.map(i => i.title.toLowerCase()).join(' ');

    const gaps: { category: string; severity: string; description: string; suggestion: string }[] = [];
    if (!allContent.includes('pricing') && !allTitles.includes('pricing')) {
      gaps.push({ category: 'Pricing', severity: 'high', description: 'No pricing info', suggestion: 'Add a document describing your pricing.' });
    }
    if (!profile?.bio) {
      gaps.push({ category: 'About', severity: 'high', description: 'No about/bio', suggestion: 'Upload a personal bio document.' });
    }
    if (!allContent.includes('contact') && !allContent.includes('email')) {
      gaps.push({ category: 'Contact', severity: 'high', description: 'No contact info', suggestion: 'Add contact details so visitors can reach you.' });
    }
    if (!allContent.includes('faq') && !allTitles.includes('faq')) {
      gaps.push({ category: 'FAQ', severity: 'medium', description: 'No FAQ', suggestion: 'Create an FAQ document with common questions.' });
    }
    if (items.length < 5) {
      gaps.push({ category: 'Quantity', severity: 'medium', description: `Only ${items.length} items`, suggestion: `Upload ${5 - items.length} more items.` });
    }

    const CATEGORIES = [
      { id: 'bio', label: 'Bio / About', keywords: ['i am', 'i\'m', 'my name', 'based in'] },
      { id: 'pricing', label: 'Pricing', keywords: ['pricing', 'price', 'cost', 'plan', 'pay'] },
      { id: 'contact', label: 'Contact', keywords: ['email', 'contact', 'reach', 'dm', 'twitter'] },
      { id: 'services', label: 'Services', keywords: ['service', 'offer', 'consulting', 'freelance'] },
      { id: 'experience', label: 'Experience', keywords: ['experience', 'work', 'built', 'created', 'project'] },
      { id: 'faq', label: 'FAQ', keywords: ['faq', 'frequently asked', 'what is', 'how do'] },
      { id: 'skills', label: 'Skills', keywords: ['skill', 'expertise', 'proficient', 'technology', 'tool'] },
    ];

    const coveredCategories = CATEGORIES.map(cat => ({
      ...cat,
      covered: cat.keywords.some(kw => allContent.includes(kw)),
    }));

    const count = coveredCategories.filter(c => c.covered).length;
    const coverageScore = CATEGORIES.length > 0 ? Math.round((count / CATEGORIES.length) * 100) : 0;

    return {
      health: { score: Math.min(score, 100), freshness, completeness: completenessScore, coverage: Math.round(coverage), quality: qualityScore, items: items.length, details: completenessChecks },
      gaps: { gaps, total: gaps.length },
      coverage: { score: coverageScore, covered: coveredCategories, totalCovered: count, totalCategories: CATEGORIES.length },
      analyzedAt: Date.now(),
    };
  },
});
