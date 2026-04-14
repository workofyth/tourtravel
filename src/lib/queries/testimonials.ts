import { pool } from '../db';
import { Testimonial } from '@/types';

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
  return result.rows;
};

export const getActiveTestimonials = async (): Promise<Testimonial[]> => {
  const result = await pool.query('SELECT * FROM testimonials WHERE is_active = true ORDER BY created_at DESC');
  return result.rows;
};

export const getTestimonialById = async (id: string): Promise<Testimonial | null> => {
  const result = await pool.query('SELECT * FROM testimonials WHERE id = $1', [id]);
  return result.rows[0] || null;
};
