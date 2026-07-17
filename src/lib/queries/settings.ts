import { pool } from '../db';
import { SiteSettings } from '@/types';
import { getLocale, localeCols } from '@/lib/i18n-db';

export const getSiteSettings = async (_locale?: string): Promise<SiteSettings | null> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'site_settings', ['site_name', 'address'])} FROM site_settings WHERE id = 1`);
  return result.rows[0] || null;
};
