import { pool } from '../db';
import { Transportation } from '@/types';

export const getAllTransportations = async (): Promise<Transportation[]> => {
  const result = await pool.query('SELECT * FROM transportations ORDER BY created_at DESC');
  return result.rows;
};

export const getActiveTransportations = async (): Promise<Transportation[]> => {
  const result = await pool.query('SELECT * FROM transportations WHERE is_active = true ORDER BY created_at DESC');
  return result.rows;
};

export const getTransportationById = async (id: string): Promise<Transportation | null> => {
  const result = await pool.query('SELECT * FROM transportations WHERE id = $1', [id]);
  return result.rows[0] || null;
};

export const getTransportationBySlug = async (slug: string): Promise<Transportation | null> => {
  const result = await pool.query('SELECT * FROM transportations WHERE slug = $1', [slug]);
  return result.rows[0] || null;
};
