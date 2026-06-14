const fs = require('fs');

const files = [
  'app/(space)/[username]/page.tsx',
  'components/AppearanceTab.tsx',
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content
    .replace(/Twitter/g, 'XIcon')
    .replace(/Github/g, 'GithubIcon')
    .replace(/Linkedin/g, 'LinkedinIcon')
    .replace(
      "import { Send, Brain, Sparkles, Copy, Check, XIcon, GithubIcon, Globe, LinkedinIcon } from 'lucide-react';",
      "import { Send, Brain, Sparkles, Copy, Check, Globe } from 'lucide-react';\nimport { FaXTwitter as XIcon, FaGithub as GithubIcon, FaLinkedin as LinkedinIcon } from 'react-icons/fa6';"
    )
    .replace(
      'import { Check, Loader2, Save, XIcon, GithubIcon, Globe, LinkedinIcon } from "lucide-react";',
      'import { Check, Loader2, Save, Globe } from "lucide-react";\nimport { FaXTwitter as XIcon, FaGithub as GithubIcon, FaLinkedin as LinkedinIcon } from "react-icons/fa6";'
    );
  fs.writeFileSync(f, content);
  console.log('✅ Fixed icons in ' + f);
});
