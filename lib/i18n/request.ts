import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocales = ['en', 'de'];
  if (!validLocales.includes(locale)) {
    locale = 'en';
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
