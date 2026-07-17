import { pool } from '../db';
import { Testimonial } from '@/types';
import { getLocale, localeCols } from '@/lib/i18n-db';

export const getAllTestimonials = async (_locale?: string): Promise<Testimonial[]> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'testimonials', ['name', 'role', 'content'])} FROM testimonials ORDER BY created_at DESC`);
  return result.rows;
};

export const getActiveTestimonials = async (_locale?: string): Promise<Testimonial[]> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'testimonials', ['name', 'role', 'content'])} FROM testimonials WHERE is_active = true ORDER BY created_at DESC`);
  return result.rows;
};

export const getTestimonialById = async (id: string, _locale?: string): Promise<Testimonial | null> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'testimonials', ['name', 'role', 'content'])} FROM testimonials WHERE id = $1`, [id]);
  return result.rows[0] || null;
};
