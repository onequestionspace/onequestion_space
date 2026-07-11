const fs = require('fs');

// Track pageviews on space page
let spacePage = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

spacePage = spacePage.replace(
  `  const incrementVisitor = useMutation(api.analytics.incrementVisitorCount);`,
  `  const incrementVisitor = useMutation(api.analytics.incrementVisitorCount);
  const trackPageview = useMutation(api.siteAnalytics.trackPageview);`
);

spacePage = spacePage.replace(
  `  useEffect(() => {
    if (profile?._id) {
      const key = 'visited_' + profile._id;
      const last = localStorage.getItem(key);
      const now = Date.now();
      if (!last || now - parseInt(last) > 86400000) {
        incrementVisitor({ profileId: profile._id }).catch(() => {});
        localStorage.setItem(key, now.toString());
      }
    }
  }, [profile?._id, incrementVisitor]);`,
  `  useEffect(() => {
    if (profile?._id) {
      const key = 'visited_' + profile._id;
      const last = localStorage.getItem(key);
      const now = Date.now();
      if (!last || now - parseInt(last) > 86400000) {
        incrementVisitor({ profileId: profile._id }).catch(() => {});
        localStorage.setItem(key, now.toString());
      }
      // Track sitewide pageview
      trackPageview({
        page: '/' + username,
        visitorId: visitorId || 'anon',
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      }).catch(() => {});
    }
  }, [profile?._id, incrementVisitor, trackPageview, username, visitorId]);`
);

fs.writeFileSync('app/(space)/[username]/page.tsx', spacePage);
console.log('Space page tracking done');
