const fs = require('fs');

let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Add useEffect and useSearchParams imports
billing = billing.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';\nimport { useSearchParams } from 'next/navigation';"
);

// Add searchParams and verify logic after const [loading] line
billing = billing.replace(
  "  const [loading, setLoading] = useState('');",
  "  const [loading, setLoading] = useState('');\n  const [verifyStatus, setVerifyStatus] = useState('');\n  const searchParams = useSearchParams();\n\n  useEffect(() => {\n    const reference = searchParams.get('reference');\n    if (!reference) return;\n    setVerifyStatus('verifying');\n    fetch('/api/paystack/verify?reference=' + reference)\n      .then(r => r.json())\n      .then(data => {\n        if (data.success && data.data?.status === 'success') {\n          setVerifyStatus('success');\n        } else {\n          setVerifyStatus('failed');\n        }\n      })\n      .catch(() => setVerifyStatus('failed'));\n  }, [searchParams]);"
);

// Add verify banner before the main content div
billing = billing.replace(
  "      <div className='max-w-3xl mx-auto space-y-8'>",
  "      <div className='max-w-3xl mx-auto space-y-8'>\n        {verifyStatus === 'verifying' && (\n          <div className='p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary flex items-center gap-2'>\n            <Loader2 className='w-4 h-4 animate-spin' /> Verifying your payment...\n          </div>\n        )}\n        {verifyStatus === 'success' && (\n          <div className='p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-sm text-green-400 flex items-center gap-2'>\n            <Check className='w-4 h-4' /> Payment successful! Your credits have been added.\n          </div>\n        )}\n        {verifyStatus === 'failed' && (\n          <div className='p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400'>\n            Payment verification failed. Contact support if you were charged.\n          </div>\n        )}"
);

// Wrap in Suspense since we use useSearchParams
billing = billing.replace(
  "'use client';",
  "'use client';\nimport { Suspense } from 'react';"
);

billing = billing.replace(
  "export default function BillingPage() {",
  "function BillingContent() {"
);

billing += "\n\nexport default function BillingPage() {\n  return (\n    <Suspense fallback={<div className='min-h-screen flex items-center justify-center text-muted-foreground'>Loading...</div>}>\n      <BillingContent />\n    </Suspense>\n  );\n}";

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('billing page verify flow added');
