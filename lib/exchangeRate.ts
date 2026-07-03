let cachedRate: { rate: number; timestamp: number } | null = null;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
const FALLBACK_RATE = 1380;

export async function getUsdToNgnRate(): Promise<number> {
  if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION_MS) {
    return cachedRate.rate;
  }
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    const rate = data?.rates?.NGN;
    if (typeof rate === 'number' && rate > 0) {
      cachedRate = { rate, timestamp: Date.now() };
      return rate;
    }
  } catch (err) {
    console.error('Exchange rate fetch failed, using fallback:', err);
  }
  return FALLBACK_RATE;
}
