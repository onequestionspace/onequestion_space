const fs = require('fs');

let problem = fs.readFileSync('components/ProblemSection.tsx', 'utf8');

// Replace the DmBubble component to support image avatars
const oldBubble = `function DmBubble({ name, msg, time }: { name: string; msg: string; time: string }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/70 text-xs font-medium">{name}</span>
          <span className="text-white/30 text-xs">{time}</span>
        </div>
        <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2">
          <p className="text-white/80 text-sm leading-snug">{msg}</p>
        </div>
      </div>
    </div>
  );
}`;

const newBubble = `const AVATAR_MAP: Record<string, string> = {
  'Asym A.': '/founders/asym.png',
  'Paraja M.': '/founders/paraja.png',
};

function getDiceBear(name: string) {
  const seed = encodeURIComponent(name);
  return 'https://api.dicebear.com/9.x/notionists/svg?seed=' + seed + '&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf';
}

function DmBubble({ name, msg, time }: { name: string; msg: string; time: string }) {
  const avatar = AVATAR_MAP[name] || getDiceBear(name);
  const isReal = !!AVATAR_MAP[name];
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/70 text-xs font-medium">{name}</span>
          <span className="text-white/30 text-xs">{time}</span>
        </div>
        <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2">
          <p className="text-white/80 text-sm leading-snug">{msg}</p>
        </div>
      </div>
    </div>
  );
}`;

// Update DMs to include Asym and Paraja
const oldDms = `const dms = [
  { name: 'Sarah K.', msg: 'Hey what exactly do you do?', time: '2m ago' },
  { name: 'James O.', msg: 'How much do you charge?', time: '5m ago' },
  { name: 'Amina B.', msg: 'Can we work together?', time: '8m ago' },
  { name: 'Raj P.', msg: 'What services do you offer?', time: '11m ago' },
  { name: 'Lena M.', msg: 'How do I contact you?', time: '14m ago' },
  { name: 'Carlos T.', msg: 'Do you do consulting?', time: '17m ago' },
  { name: 'Fatima A.', msg: 'Can you explain your process?', time: '20m ago' },
  { name: 'Mike D.', msg: 'Are you available to hire?', time: '23m ago' },
  { name: 'Priya S.', msg: 'What tools do you use?', time: '26m ago' },
  { name: 'Noah L.', msg: 'Do you take on new clients?', time: '29m ago' },
];`;

const newDms = `const dms = [
  { name: 'Asym A.', msg: 'How do you build without a laptop?', time: '1m ago' },
  { name: 'Sarah K.', msg: 'Hey what exactly do you do?', time: '2m ago' },
  { name: 'Paraja M.', msg: 'What is One Question about?', time: '4m ago' },
  { name: 'James O.', msg: 'How much do you charge?', time: '5m ago' },
  { name: 'Amina B.', msg: 'Can we work together?', time: '8m ago' },
  { name: 'Raj P.', msg: 'What services do you offer?', time: '11m ago' },
  { name: 'Lena M.', msg: 'How do I contact you?', time: '14m ago' },
  { name: 'Carlos T.', msg: 'Do you do consulting?', time: '17m ago' },
  { name: 'Fatima A.', msg: 'Can you explain your process?', time: '20m ago' },
  { name: 'Mike D.', msg: 'Are you available to hire?', time: '23m ago' },
  { name: 'Priya S.', msg: 'What tools do you use?', time: '26m ago' },
  { name: 'Noah L.', msg: 'Do you take on new clients?', time: '29m ago' },
];`;

problem = problem.replace(oldDms, newDms);
problem = problem.replace(oldBubble, newBubble);

fs.writeFileSync('components/ProblemSection.tsx', problem);
console.log('done — real photos for Asym + Paraja, DiceBear for rest');
