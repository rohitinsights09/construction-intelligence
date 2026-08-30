/**
 * Enterprise Construction Intelligence Formatters
 * Formats currencies, percentages, durations, ratings with precision
 */

export function formatCurrency(value: number | undefined | null, compact = false): string {
  if (value === undefined || value === null || isNaN(value)) return '$0';
  
  if (compact) {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absVal >= 1_000_000_000) {
      return `${sign}$${(absVal / 1_000_000_000).toFixed(2)}B`;
    }
    if (absVal >= 1_000_000) {
      return `${sign}$${(absVal / 1_000_000).toFixed(2)}M`;
    }
    if (absVal >= 1_000) {
      return `${sign}$${(absVal / 1_000).toFixed(1)}K`;
    }
    return `${sign}$${absVal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number | undefined | null, includeSign = false, decimals = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatDays(days: number | undefined | null, includeSign = false): string {
  if (days === undefined || days === null || isNaN(days)) return '0 days';
  const rounded = Math.round(days);
  const sign = includeSign && rounded > 0 ? '+' : '';
  return `${sign}${rounded.toLocaleString()} d`;
}

export function formatNumber(value: number | undefined | null, decimals = 0): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}
