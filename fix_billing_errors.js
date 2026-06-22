const fs = require('fs');

let billing = fs.readFileSync('app/dashboard/billing/page.tsx', 'utf8');

// Add error state
billing = billing.replace(
  "  const [loading, setLoading] = useState('');",
  "  const [loading, setLoading] = useState('');\n  const [error, setError] = useState('');"
);

// Fix handleUpgrade with proper error handling
billing = billing.replace(
  `  const handleUpgrade = async (planId: string, priceNGN: number) => {
    if (!userId) return;
    setLoading(planId);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceNGN * 100, // kobo
          email: '',
          metadata: { userId, plan: planId, type: 'subscription' },
        }),
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      }
    } catch (e) { console.error(e); }
    setLoading('');
  };`,
  `  const handleUpgrade = async (planId: string, priceNGN: number) => {
    if (!userId) return;
    setLoading(planId);
    setError('');
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceNGN * 100,
          metadata: { plan: planId, type: 'subscription' },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to start checkout. Please try again.');
        setLoading('');
        return;
      }
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        setError('No checkout URL returned. Please try again.');
        setLoading('');
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please check your connection and try again.');
      setLoading('');
    }
  };`
);

// Fix handleBuyCredits with proper error handling
billing = billing.replace(
  `  const handleBuyCredits = async () => {
    if (!userId) return;
    setLoading('credits');
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(creditAmount * CREDIT_PRICE * 100), // kobo
          email: '',
          metadata: { userId, credits: creditAmount, type: 'credits' },
        }),
      });
      const data = await res.json();
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      }
    } catch (e) { console.error(e); }
    setLoading('');
  };`,
  `  const handleBuyCredits = async () => {
    if (!userId) return;
    setLoading('credits');
    setError('');
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(creditAmount * CREDIT_PRICE * 100),
          metadata: { credits: creditAmount, type: 'credits' },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to start checkout. Please try again.');
        setLoading('');
        return;
      }
      if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        setError('No checkout URL returned. Please try again.');
        setLoading('');
      }
    } catch (e) {
      console.error(e);
      setError('Something went wrong. Please check your connection and try again.');
      setLoading('');
    }
  };`
);

// Show error banner in UI — add right after the opening max-w-3xl div
billing = billing.replace(
  "      <div className='max-w-3xl mx-auto space-y-8'>",
  "      <div className='max-w-3xl mx-auto space-y-8'>\n\n        {error && (\n          <div className='p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm'>\n            {error}\n          </div>\n        )}"
);

fs.writeFileSync('app/dashboard/billing/page.tsx', billing);
console.log('1 error handling added — failures now show on screen instead of silent loop');
