const fs = require('fs');

let layout = fs.readFileSync('components/DashboardLayout.tsx', 'utf8');

// Move DashboardAI outside main content area
layout = layout.replace(
  "      <DashboardAI />\n\n      {/* Overlay */}",
  "      {/* Overlay */}"
);

// Add it right before closing div of the whole component
layout = layout.replace(
  "    </div>\n  );\n}",
  "      <DashboardAI />\n    </div>\n  );\n}"
);

fs.writeFileSync('components/DashboardLayout.tsx', layout);
console.log('1 DashboardAI moved to bottom of layout');

// Fix the chat panel styling — less transparent, more solid
let ai = fs.readFileSync('components/DashboardAI.tsx', 'utf8');

ai = ai.replace(
  "        <div className='fixed bottom-20 right-6 z-50 w-80 h-96 glass-card rounded-2xl border border-border flex flex-col overflow-hidden shadow-2xl'>",
  "        <div className='fixed bottom-20 right-6 z-50 w-80 h-96 rounded-2xl border border-white/20 flex flex-col overflow-hidden shadow-2xl' style={{ backgroundColor: '#0f0f0f' }}>"
);

ai = ai.replace(
  "            <div className='flex items-center gap-2 px-4 py-3 border-b border-border bg-card'>",
  "            <div className='flex items-center gap-2 px-4 py-3 border-b border-white/10' style={{ backgroundColor: '#1a1a1a' }}>"
);

ai = ai.replace(
  "            <div className='flex-1 overflow-y-auto p-3 space-y-3'>",
  "            <div className='flex-1 overflow-y-auto p-3 space-y-3' style={{ backgroundColor: '#0f0f0f' }}>"
);

ai = ai.replace(
  "              <div className={'max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ' + (m.role === 'user' ? 'bg-primary text-white' : 'bg-card border border-border text-foreground')}>",
  "              <div className={'max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ' + (m.role === 'user' ? 'bg-primary text-white' : 'border border-white/10 text-white')} style={m.role === 'assistant' ? { backgroundColor: '#1a1a1a' } : {}}>"
);

ai = ai.replace(
  "          <div className='flex items-center gap-2 px-3 py-2 border-t border-border'>",
  "          <div className='flex items-center gap-2 px-3 py-2 border-t border-white/10' style={{ backgroundColor: '#1a1a1a' }}>"
);

ai = ai.replace(
  "              className='flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none'",
  "              className='flex-1 bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none'"
);

fs.writeFileSync('components/DashboardAI.tsx', ai);
console.log('2 AI chat panel made solid');
