import { pool } from '../db';
import { Category } from '@/types';
import { getLocale, localeCols } from '@/lib/i18n-db';

export const getAllCategories = async (_locale?: string): Promise<Category[]> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'categories', ['name', 'description'])} FROM categories ORDER BY categories.name ASC`);
  return result.rows;
};

export const getCategoryById = async (id: string, _locale?: string): Promise<Category | null> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'categories', ['name', 'description'])} FROM categories WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

export const getCategoryCategories = async (): Promise<string[]> => {
  const result = await pool.query("SELECT DISTINCT category FROM categories WHERE category IS NOT NULL AND category != '' ORDER BY category ASC");
  return result.rows.map(row => row.category);
};
