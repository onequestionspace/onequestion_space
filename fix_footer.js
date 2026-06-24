const fs = require('fs');
let code = fs.readFileSync('app/(space)/[username]/page.tsx', 'utf8');

code = code.replace(
  `        <p className='text-center text-xs text-zinc-600'>
          Powered by{' '}
          <a href='https://onequestion.space' className='hover:text-zinc-400 transition-colors font-medium' style={{ color }}>One Question</a>
        </p>`,
  ``
);

fs.writeFileSync('app/(space)/[username]/page.tsx', code);
console.log('Done');
