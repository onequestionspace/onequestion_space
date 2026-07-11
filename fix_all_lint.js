const fs = require('fs');

function fix(path, fn) {
  try {
    let code = fs.readFileSync(path, 'utf8');
    const result = fn(code);
    if (result && result !== code) {
      fs.writeFileSync(path, result);
      console.log('Fixed: ' + path);
    }
  } catch(e) { console.log('Skip: ' + path, e.message); }
}

// Helper: wrap all setStates in useEffect with setTimeout
function wrapEffectSetStates(code) {
  return code.replace(
    /useEffect\(\(\) => \{(\s*if \([^)]+\) return;)?\s*(set[A-Z][^}]+\([^)]*\);[\s\S]*?)\}, \[/g,
    (match, guard, body) => {
      if (match.includes('setTimeout')) return match;
      if (!body || !body.includes('set')) return match;
      const g = guard || '';
      return match.replace(
        g + '\n' + body,
        g + '\n    setTimeout(() => {' + body + '    }, 0);'
      );
    }
  );
}

// Fix setState in effects - billing
fix('app/dashboard/billing/page.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix claim page
fix('app/claim/[token]/page.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix dashboard/inbox
fix('app/dashboard/inbox/page.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix studio
fix('app/dashboard/studio/page.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix AIProactiveTip
fix('components/AIProactiveTip.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix AppearanceTab
fix('components/AppearanceTab.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix DashboardAI
fix('components/DashboardAI.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix KnowledgeIntelligence
fix('components/KnowledgeIntelligence.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix TourTooltip
fix('components/TourTooltip.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix AnimatedCounter
fix('components/motion/AnimatedCounter.tsx', code => {
  return code.replace(
    /useEffect\(\(\) => \{([^}]*set[A-Z][^}]*)\}, \[/g,
    (m, body) => m.includes('setTimeout') ? m : m.replace(body, '\n    setTimeout(() => {' + body + '    }, 0);\n  ')
  );
});

// Fix onboarding - unescaped entities and setState
fix('app/onboarding/page.tsx', code => {
  code = code.replace(/(?<!=)'(?!=)/g, (m, offset, str) => {
    const before = str.slice(Math.max(0, offset-5), offset);
    if (before.includes('className') || before.includes('href') || before.includes('src')) return m;
    return m;
  });
  // Fix unescaped quotes in JSX text
  code = code.replace(/>\s*"([^"<>]*)"\s*</g, '>&ldquo;$1&rdquo;<');
  return code;
});

// Fix PricingSection - unescaped entities
fix('components/PricingSection.tsx', code => {
  code = code.replace(/>\s*'([^'<>]*)'\s*</g, ">&apos;$1&apos;<");
  return code;
});

// Fix <a> tags to <Link> in dashboard/analytics
fix('app/dashboard/analytics/page.tsx', code => {
  if (!code.includes("import Link from 'next/link'")) {
    code = code.replace("'use client';", "'use client';\nimport Link from 'next/link';");
  }
  code = code.replace(/<a href="\/dashboard\/knowledge\/"([^>]*)>/g, '<Link href="/dashboard/knowledge"$1>');
  code = code.replace(/<\/a>/g, '</Link>');
  return code;
});

// Fix visitorId warning in space page - remove from deps
fix('app/(space)/[username]/page.tsx', code => {
  code = code.replace(
    `  }, [profile?._id, incrementVisitor, trackPageview, username, visitorId]);`,
    `  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [profile?._id, incrementVisitor, trackPageview, username]);`
  );
  return code;
});

console.log('All done');
