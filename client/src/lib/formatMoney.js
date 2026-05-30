/** Format amount using ISO 4217 code (handles decimals per currency, e.g. JPY). */
export function formatMoney(amount, currencyCode = 'USD') {
  const code = currencyCode || 'USD';
  const value = Number(amount);
  if (Number.isNaN(value)) return '—';

  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'symbol',
    }).format(value);
  } catch {
    return `${code} ${value.toFixed(2)}`;
  }
}

export function getCurrencyMeta(currencies, code) {
  return currencies.find((c) => c.code === code) || { code, name: code, symbol: code };
}
