import { pool } from '../db';
import { getLocale, localeCols } from '@/lib/i18n-db';

export interface GalleryItem {
  id: string;
  title: string | null;
  title_en?: string | null;
  title_es?: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export const getAllGalleryItems = async (_locale?: string): Promise<GalleryItem[]> => {
  const locale = _locale || await getLocale();
  try {
    const result = await pool.query(`SELECT *${localeCols(locale, 'galleries', ['title'])} FROM galleries ORDER BY sort_order ASC, created_at DESC`);
    return result.rows;
  } catch (error: any) {
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
};

export const getGalleryItemById = async (id: string, _locale?: string): Promise<GalleryItem | null> => {
  const locale = _locale || await getLocale();
  const result = await pool.query(`SELECT *${localeCols(locale, 'galleries', ['title'])} FROM galleries WHERE id = $1`, [id]);
  return result.rows[0] || null;
};
