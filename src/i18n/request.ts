import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const { cookies, headers } = await import('next/headers');
  const cookieStore = await cookies();
  const headerStore = await headers();

  let locale = cookieStore.get('NEXT_LOCALE')?.value;
  if (!locale) {
    const acceptLang = headerStore.get('accept-language') || '';
    if (acceptLang.startsWith('es')) locale = 'es';
    else locale = 'en';
  }
  if (locale !== 'en' && locale !== 'es') locale = 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
