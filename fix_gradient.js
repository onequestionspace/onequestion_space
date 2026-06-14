const fs = require('fs');

const fixes = [
  {
    file: 'components/HowItWorks.tsx',
    from: '<span className="gradient-text">Works</span>',
    to: 'Works'
  },
  {
    file: 'components/PricingSection.tsx',
    from: '<span className="gradient-text">Scale When It Works.</span>',
    to: '<span className="text-white">Scale When It Works.</span>'
  },
  {
    file: 'components/ProfilePreview.tsx',
    from: '<span className="gradient-text-alt">In Action</span>',
    to: 'In Action'
  },
  {
    file: 'components/TeamSection.tsx',
    from: '<span className="gradient-text">Team</span>',
    to: 'Team'
  },
  {
    file: 'components/ProductExplainer.tsx',
    from: '<span className="gradient-text">One Question?</span>',
    to: 'One Question?'
  },
  {
    file: 'components/UploadSection.tsx',
    from: '<span className="gradient-text">Answer forever.</span>',
    to: '<span className="text-white">Answer forever.</span>'
  },
  {
    file: 'components/AnalyticsSection.tsx',
    from: '<span className="gradient-text">people want to know.</span>',
    to: '<span className="text-white">people want to know.</span>'
  },
  {
    file: 'components/ProfilesSection.tsx',
    from: '<span className="gradient-text">founders and experts.</span>',
    to: '<span className="text-white">founders and experts.</span>'
  },
];

let changed = 0;
fixes.forEach(({ file, from, to }) => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(from)) {
      fs.writeFileSync(file, content.replace(from, to));
      console.log('✅ Fixed:', file);
      changed++;
    } else {
      console.log('⚠️  Not found:', file, '|', from);
    }
  } catch (e) {
    console.log('❌ Error:', file, e.message);
  }
});
console.log(`\nDone. ${changed}/${fixes.length} files updated.`);
