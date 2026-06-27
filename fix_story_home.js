const fs = require('fs');
let f = fs.readFileSync('app/page.tsx', 'utf8');
if (!f.includes('StorySection')) {
  f = f.replace("import { CTASection }", "import { StorySection } from '@/components/StorySection';\nimport { CTASection }");
  f = f.replace('<PricingSection />', '<StorySection />\n      </FadeInSection>\n      <FadeInSection delay={0}>\n        <PricingSection />');
  fs.writeFileSync('app/page.tsx', f);
  console.log('homepage done');
} else {
  console.log('already done');
}
