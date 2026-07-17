import { cookies } from 'next/headers';

export async function getLocale(): Promise<string> {
  const c = await cookies();
  return c.get('NEXT_LOCALE')?.value || 'en';
}

export function localeCols(locale: string, prefix: string, cols: string[]): string {
  if (locale === 'en') return '';
  return ', ' + cols.map(c => `COALESCE(${prefix}.${c}_${locale}, ${prefix}.${c}) AS ${c}`).join(', ');
}

export function localeAlias(locale: string, prefix: string, col: string, alias: string): string {
  if (locale === 'en') return `${prefix}.${col} as ${alias}`;
  return `COALESCE(${prefix}.${col}_${locale}, ${prefix}.${col}) as ${alias}`;
}
