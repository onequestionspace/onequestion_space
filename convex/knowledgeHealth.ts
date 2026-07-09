import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getKnowledgeHealth = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
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

export const getKnowledgeGaps = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const profile = await ctx.db.query('profiles')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .unique();

    const allContent = items.map(i => i.content.toLowerCase()).join(' ');
    const allTitles = items.map(i => i.title.toLowerCase()).join(' ');

    const gaps: { category: string; severity: 'low' | 'medium' | 'high'; description: string; suggestion: string }[] = [];

    if (!allContent.includes('pricing') && !allTitles.includes('pricing') && !allContent.includes('price') && !allContent.includes('cost')) {
      gaps.push({ category: 'Pricing', severity: 'high', description: 'No pricing information found', suggestion: 'Add a document describing your pricing, plans, or rates so visitors know what things cost.' });
    }
    if (!allContent.includes('about me') && !allContent.includes('about') && !profile?.bio) {
      gaps.push({ category: 'About', severity: 'high', description: 'No about/bio content found', suggestion: 'Upload a personal bio or background document so your AI knows who you are.' });
    }
    if (!allContent.includes('contact') && !allContent.includes('email') && !allContent.includes('reach')) {
      gaps.push({ category: 'Contact', severity: 'high', description: 'No contact information found', suggestion: 'Add contact details so visitors know how to reach you (email, social, calendar link).' });
    }
    if (!allContent.includes('faq') && !allTitles.includes('faq') && !allContent.includes('frequently asked')) {
      gaps.push({ category: 'FAQ', severity: 'medium', description: 'No FAQ section found', suggestion: 'Create an FAQ document with common questions you receive.' });
    }
    if (!allContent.includes('service') && !allContent.includes('offer') && !allContent.includes('product')) {
      gaps.push({ category: 'Services', severity: 'medium', description: 'No services or offerings described', suggestion: 'Describe what services, products, or work you do to help visitors understand your value.' });
    }
    if (!allContent.includes('testimonial') && !allContent.includes('review') && !allContent.includes('client')) {
      gaps.push({ category: 'Testimonials', severity: 'low', description: 'No testimonials or reviews found', suggestion: 'Add testimonials from clients or partners to build trust with visitors.' });
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
    const items = await ctx.db.query('knowledge')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .collect();

    const allContent = items.map(i => i.content.toLowerCase()).join(' ');

    const CATEGORIES = [
      { id: 'bio', label: 'Bio / About', keywords: ['i am', 'i\'m', 'my name', 'based in', 'from'] },
      { id: 'pricing', label: 'Pricing', keywords: ['pricing', 'price', 'cost', 'plan', 'pay', 'subscription', 'per month', 'per hour'] },
      { id: 'contact', label: 'Contact', keywords: ['email', 'contact', 'reach', 'dm', 'twitter', 'x.com', 'linkedin', 'calendly'] },
      { id: 'services', label: 'Services', keywords: ['service', 'offer', 'consulting', 'coaching', 'freelance', 'build', 'develop'] },
      { id: 'experience', label: 'Experience', keywords: ['experience', 'work', 'built', 'created', 'project', 'client', 'company'] },
      { id: 'faq', label: 'FAQ', keywords: ['faq', 'frequently asked', 'what is', 'how do', 'can you'] },
      { id: 'testimonials', label: 'Testimonials', keywords: ['testimonial', 'review', 'client said', 'customer', 'feedback'] },
      { id: 'skills', label: 'Skills', keywords: ['skill', 'expertise', 'proficient', 'know', 'technology', 'tool', 'language'] },
    ];

    const covered = CATEGORIES.map(cat => {
      const detected = cat.keywords.some(kw => allContent.includes(kw));
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
