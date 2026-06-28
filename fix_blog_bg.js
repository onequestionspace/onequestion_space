const fs = require('fs');

['app/blog/page.tsx', 'app/blog/[slug]/page.tsx'].forEach(path => {
  let c = fs.readFileSync(path, 'utf8');
  c = c.replace(`        <div className="mesh-gradient" />\n`, '');
  c = c.replace(`        <div className="dot-pattern" />\n`, '');
  fs.writeFileSync(path, c);
  console.log('fixed:', path);
});
