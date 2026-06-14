const fs = require('fs');

let content = fs.readFileSync('app/dashboard/settings/page.tsx', 'utf8');

// Replace the broken handleAvatarUpload function
const oldFn = `  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        await updateProfile({ avatar: data.url });
      }
    } catch (e) { console.error(e); }
    setAvatarUploading(false);
  };`;

const newFn = `  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mimeType: file.type }),
      });
      const data = await res.json();
      if (data.dataUrl) {
        await updateProfile({ avatar: data.dataUrl });
      } else {
        console.error('Avatar upload failed:', data.error);
      }
    } catch (e) { console.error(e); }
    setAvatarUploading(false);
  };`;

if (!content.includes(oldFn)) {
  console.log('❌ Could not find handleAvatarUpload — check manually');
  process.exit(1);
}

content = content.replace(oldFn, newFn);
fs.writeFileSync('app/dashboard/settings/page.tsx', content);
console.log('✅ handleAvatarUpload patched to use /api/avatar');
