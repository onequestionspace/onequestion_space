const fs = require('fs');

let dash = fs.readFileSync('app/dashboard/page.tsx', 'utf8');

// Add data-tour to share link button
dash = dash.replace(
  `<button onClick={copyProfileLink} className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-primary transition-colors'>`,
  `<button data-tour="share" onClick={copyProfileLink} className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-primary transition-colors'>`
);

// Add data-tour to stats grid
dash = dash.replace(
  `        {/* Stats Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>`,
  `        {/* Stats Grid */}
        <div data-tour="stats" className='grid grid-cols-2 lg:grid-cols-4 gap-4'>`
);

fs.writeFileSync('app/dashboard/page.tsx', dash);

// Add data-tour to studio tabs and preview
let studio = fs.readFileSync('app/dashboard/studio/page.tsx', 'utf8');

studio = studio.replace(
  `            <div className="flex gap-1 overflow-x-auto pb-1">`,
  `            <div data-tour="tabs" className="flex gap-1 overflow-x-auto pb-1">`
);

studio = studio.replace(
  `              <div className="flex items-center justify-between mb-3">`,
  `              <div data-tour="preview" className="flex items-center justify-between mb-3">`
);

fs.writeFileSync('app/dashboard/studio/page.tsx', studio);
console.log('tour targets added');
