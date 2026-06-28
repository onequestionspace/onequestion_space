const fs = require('fs');

// Add to dashboard
let dash = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// Add import
dash = dash.replace(
  `'use client';`,
  `'use client';`
);
dash = dash.replace(
  `import { DashboardLayout } from '@/components/DashboardLayout';`,
  `import { DashboardLayout } from '@/components/DashboardLayout';
import { WelcomeModal } from '@/components/WelcomeModal';
import { TourTooltip } from '@/components/TourTooltip';`
);

// Add state after existing state
dash = dash.replace(
  `  const [copied, setCopied] = useState(false);`,
  `  const [copied, setCopied] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);`
);

// Add useEffect to show welcome for new users
dash = dash.replace(
  `  useEffect(() => {
    if (profile === null && isSignedIn) {
      createProfile({}).catch(console.error);
    }`,
  `  useEffect(() => {
    if (profile === null && isSignedIn) {
      createProfile({}).catch(console.error);
    }
    // Show welcome modal for new users
    if (profile && !localStorage.getItem('oq_welcome_seen')) {
      setShowWelcome(true);
    }`
);

// Add modal to JSX before closing DashboardLayout
dash = dash.replace(
  `    </DashboardLayout>
  );
}`,
  `      {showWelcome && (
        <WelcomeModal
          username={profile?.username}
          onDone={() => {
            setShowWelcome(false);
            localStorage.setItem('oq_welcome_seen', '1');
            setTimeout(() => setShowTour(true), 500);
          }}
        />
      )}
      {showTour && (
        <TourTooltip
          steps={[
            { target: '[data-tour="share"]', title: 'Your space link', desc: 'Share this link anywhere. Visitors ask questions, your AI answers instantly.', position: 'bottom' },
            { target: '[data-tour="knowledge"]', title: 'Upload knowledge', desc: 'Add your bio, FAQs, and expertise. The more you upload, the better your AI answers.', position: 'bottom' },
            { target: '[data-tour="stats"]', title: 'Your stats', desc: 'Track questions asked, visitors, and your AI answer rate in real time.', position: 'top' },
          ]}
          onDone={() => {
            setShowTour(false);
            localStorage.setItem('oq_tour_seen', '1');
          }}
        />
      )}
    </DashboardLayout>
  );
}`
);

fs.writeFileSync('app/dashboard/page.tsx', dash);
console.log('dashboard done');

// Add to studio
let studio = fs.readFileSync('app/dashboard/studio/page.tsx', 'utf8');
studio = studio.replace(
  `import { DashboardLayout } from '@/components/DashboardLayout';`,
  `import { DashboardLayout } from '@/components/DashboardLayout';
import { TourTooltip } from '@/components/TourTooltip';`
);

studio = studio.replace(
  `  const [previewKey, setPreviewKey] = useState(0);`,
  `  const [previewKey, setPreviewKey] = useState(0);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('oq_studio_tour_seen')) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);`
);

studio = studio.replace(
  `    </DashboardLayout>
  );
}`,
  `      {showTour && (
        <TourTooltip
          steps={[
            { target: '[data-tour="tabs"]', title: 'Build your space here', desc: 'Profile, Vibe, Links, Pinned answers, and Style — each tab customizes part of your space.', position: 'bottom' },
            { target: '[data-tour="preview"]', title: 'Live preview', desc: 'See exactly how your space looks to visitors. Updates instantly when you save.', position: 'left' },
            { target: '[data-tour="save"]', title: 'Save your changes', desc: 'Hit Save after editing each section. Changes go live immediately.', position: 'top' },
          ]}
          onDone={() => {
            setShowTour(false);
            localStorage.setItem('oq_studio_tour_seen', '1');
          }}
        />
      )}
    </DashboardLayout>
  );
}`
);

fs.writeFileSync('app/dashboard/studio/page.tsx', studio);
console.log('studio done');
