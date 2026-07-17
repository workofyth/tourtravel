import { pool } from '../db';
import { PackageWithCategory } from '@/types';
import { getLocale, localeCols, localeAlias } from '@/lib/i18n-db';

export const getFeaturedPackages = async (_locale?: string): Promise<PackageWithCategory[]> => {
  const locale = _locale || await getLocale();
  const pCols = localeCols(locale, 'p', ['title', 'description']);

  const result = await pool.query(`
    SELECT p.*${pCols},
           ${localeAlias(locale, 'd', 'name', 'category_name')},
           d.slug as category_slug,
           COALESCE(NULLIF(d.category, ''), d.slug) as category_type
    FROM packages p
    JOIN categories d ON p.category_id = d.id
    WHERE p.is_featured = true
    ORDER BY p.created_at DESC
    LIMIT 6
  `);

  const packages = result.rows;

  for (const pkg of packages) {
    const itineraries = await pool.query(`
      SELECT *${localeCols(locale, 'itineraries', ['title', 'description'])}
      FROM itineraries
      WHERE package_id = $1
      ORDER BY day_number ASC
    `, [pkg.id]);
    pkg.itineraries = itineraries.rows;

    const images = await pool.query(`
      SELECT * FROM package_images
      WHERE package_id = $1
      ORDER BY sort_order ASC
    `, [pkg.id]);
    pkg.images = images.rows;
  }

  return packages;
};

export const getAllPackages = async (category?: string, search?: string, _locale?: string): Promise<PackageWithCategory[]> => {
  const locale = _locale || await getLocale();
  const pCols = localeCols(locale, 'p', ['title', 'description']);

  let query = `
    SELECT p.*${pCols},
           ${localeAlias(locale, 'd', 'name', 'category_name')},
           d.slug as category_slug,
           COALESCE(NULLIF(d.category, ''), d.slug) as category_type
    FROM packages p
    JOIN categories d ON p.category_id = d.id
    WHERE 1=1
  `;
  const values: any[] = [];
  let idx = 1;

  if (category) {
    query += ` AND (d.slug = $${idx} OR d.category = $${idx})`;
    idx++;
    values.push(category);
  }

  if (search) {
    query += ` AND (p.title ILIKE $${idx}`;
    if (locale !== 'en') query += ` OR p.title_${locale} ILIKE $${idx}`;
    query += `)`;
    values.push(`%${search}%`);
  }

  query += ` ORDER BY p.created_at DESC`;

  const result = await pool.query(query, values);
  const packages = result.rows;

  for (const pkg of packages) {
    const itineraries = await pool.query(`
      SELECT *${localeCols(locale, 'itineraries', ['title', 'description'])}
      FROM itineraries
      WHERE package_id = $1
      ORDER BY day_number ASC
    `, [pkg.id]);
    pkg.itineraries = itineraries.rows;
  }

  return packages;
};

export const getPackageBySlug = async (slug: string, _locale?: string): Promise<PackageWithCategory | null> => {
  const locale = _locale || await getLocale();
  const pCols = localeCols(locale, 'p', ['title', 'description']);

  const result = await pool.query(`
    SELECT p.*${pCols},
           ${localeAlias(locale, 'd', 'name', 'category_name')},
           d.slug as category_slug,
           COALESCE(NULLIF(d.category, ''), d.slug) as category_type
    FROM packages p
    JOIN categories d ON p.category_id = d.id
    WHERE p.slug = $1
  `, [slug]);

  const pkg = result.rows[0];
  if (!pkg) return null;

  const itineraries = await pool.query(`
    SELECT *${localeCols(locale, 'itineraries', ['title', 'description'])}
    FROM itineraries
    WHERE package_id = $1
    ORDER BY day_number ASC
  `, [pkg.id]);

  const images = await pool.query(`
    SELECT * FROM package_images
    WHERE package_id = $1
    ORDER BY sort_order ASC
  `, [pkg.id]);

  return { ...pkg, itineraries: itineraries.rows, images: images.rows };
};

export const getPackageTitles = async (query: string): Promise<string[]> => {
  if (!query) return [];
  const result = await pool.query(`
    SELECT title FROM packages
    WHERE title ILIKE $1
    ORDER BY title ASC
    LIMIT 5
  `, [`%${query}%`]);
  return result.rows.map(row => row.title);
};
