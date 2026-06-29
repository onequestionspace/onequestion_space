const fs = require('fs');
let c = fs.readFileSync('app/dashboard/admin/page.tsx', 'utf8');

c = c.replace(
  `      const result = grantForm.type === 'founding'
        ? await grantFoundingBadge({ adminId: adminId, ...grantForm })
        : await grantEarlyAdopterBadge({ adminId: adminId, ...grantForm });
      setMsg(result.success ? 'Badge granted!' : 'Already has badge');
      if (result.success) setGrantForm({ userId: '', username: '', displayName: '', type: 'founding' });`,
  `      const result: any = grantForm.type === 'founding'
        ? await grantFoundingBadge({ adminId: adminId, ...grantForm })
        : await grantEarlyAdopterBadge({ adminId: adminId, ...grantForm });
      setMsg(result?.success ? 'Badge granted!' : 'Already has badge');
      if (result?.success) setGrantForm({ userId: '', username: '', displayName: '', type: 'founding' });`
);

fs.writeFileSync('app/dashboard/admin/page.tsx', c);
console.log('done');
