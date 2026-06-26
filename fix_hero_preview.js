const fs = require('fs');
let h = fs.readFileSync('components/Hero.tsx', 'utf8');

h = h.replace(
  `            {isLoaded && (
              <button
                onClick={handleClaim}`,
  `            {username && (
              <p className='text-xs text-primary/80 mb-2 ml-1'>
                Your space → <span className='font-bold text-primary'>onequestion.space/{username}</span>
              </p>
            )}
            {isLoaded && (
              <button
                onClick={handleClaim}`
);

fs.writeFileSync('components/Hero.tsx', h);
console.log('done');
