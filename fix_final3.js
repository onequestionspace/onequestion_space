const fs = require('fs');

// ── Fix 1: founding page </a> → </Link> ──
let founding = fs.readFileSync('app/founding/page.tsx', 'utf8');
founding = founding.replace(
  `              Claim Early Adopter spot →\n            </a>`,
  `              Claim Early Adopter spot →\n            </Link>`
);
fs.writeFileSync('app/founding/page.tsx', founding);
console.log('Fix 1 done');

// ── Fix 2: avatar-upload line 79 <img> → <Image> ──
let avatar = fs.readFileSync('components/avatar-upload.tsx', 'utf8');
avatar = avatar.replace(
  /<img\s+src=\{([^}]+)\}\s+alt="([^"]+)"\s+className="([^"]+)"\s*\/>/,
  `<Image src={$1} alt="$2" width={80} height={80} className="$3" />`
);
fs.writeFileSync('components/avatar-upload.tsx', avatar);
console.log('Fix 2 done');

