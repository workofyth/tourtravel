import { NextResponse } from 'next/server';
import { getPackageTitles } from '@/lib/queries/packages';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const titles = await getPackageTitles(query);
    return NextResponse.json(titles);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
