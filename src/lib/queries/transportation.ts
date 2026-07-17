import { pool } from '../db';
import { Transportation } from '@/types';
import { getLocale, localeCols } from '@/lib/i18n-db';

export const getAllTransportations = async (_locale?: string): Promise<Transportation[]> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'transportations', ['name', 'description'])} FROM transportations ORDER BY created_at DESC`);
  return result.rows;
};

export const getActiveTransportations = async (_locale?: string): Promise<Transportation[]> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'transportations', ['name', 'description'])} FROM transportations WHERE is_active = true ORDER BY created_at DESC`);
  return result.rows;
};

export const getTransportationById = async (id: string, _locale?: string): Promise<Transportation | null> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'transportations', ['name', 'description'])} FROM transportations WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

export const getTransportationBySlug = async (slug: string, _locale?: string): Promise<Transportation | null> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'transportations', ['name', 'description'])} FROM transportations WHERE slug = $1`, [slug]);
  return result.rows[0] || null;
};
