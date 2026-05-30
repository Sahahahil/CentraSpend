import React, { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useCurrency } from '../context/CurrencyContext';

/** Searchable currency dropdown for expense forms (full ISO list). */
export default function CurrencyPicker({ id, value, onChange, label = 'Currency', className = '' }) {
  const { currencies, loading, getCurrency } = useCurrency();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return currencies;
    const q = query.trim().toLowerCase();
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.symbol && String(c.symbol).toLowerCase().includes(q))
    );
  }, [currencies, query]);

  const selected = getCurrency(value);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5 ml-1">
          {label}
        </label>
      )}

      <div className="space-y-2">
        <div className="input-with-icon">
          <span className="input-with-icon__icon" aria-hidden="true">
            <FiSearch />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter currencies…"
            className="input-warm input-with-icon__field text-sm"
            aria-label="Filter currencies"
          />
        </div>

        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading || currencies.length === 0}
          className="input-premium font-medium cursor-pointer"
        >
          {filtered.length === 0 ? (
            <option value={value}>No matches — clear search</option>
          ) : (
            filtered.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} — {c.name}
              </option>
            ))
          )}
        </select>
      </div>

      <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 ml-1">
        {selected.symbol} {selected.code} — {selected.name}
        {filtered.length < currencies.length && query && (
          <span> · {filtered.length} shown</span>
        )}
      </p>
    </div>
  );
}
