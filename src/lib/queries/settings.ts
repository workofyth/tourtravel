import { pool } from '../db';
import { SiteSettings } from '@/types';

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const result = await pool.query('SELECT * FROM site_settings WHERE id = 1');
  return result.rows[0] || null;
};
