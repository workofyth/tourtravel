import { pool } from '../db';

export interface GalleryItem {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export const getAllGalleryItems = async (): Promise<GalleryItem[]> => {
  try {
    const result = await pool.query('SELECT * FROM galleries ORDER BY sort_order ASC, created_at DESC');
    return result.rows;
  } catch (error: any) {
    // If table doesn't exist yet, return empty array instead of crashing
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }
};

export const getGalleryItemById = async (id: string): Promise<GalleryItem | null> => {
  const result = await pool.query('SELECT * FROM galleries WHERE id = $1', [id]);
  return result.rows[0] || null;
};
