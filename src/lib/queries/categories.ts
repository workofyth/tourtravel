import { pool } from '../db';
import { Category } from '@/types';

export const getAllCategories = async (): Promise<Category[]> => {
  const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  return result.rows;
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getCategoryCategories = async (): Promise<string[]> => {
  const result = await pool.query("SELECT DISTINCT category FROM categories WHERE category IS NOT NULL AND category != '' ORDER BY category ASC");
  return result.rows.map(row => row.category);
};
