import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const allMessages = (await import(`../messages/messages.json`)).default;

  return {
    locale,
    messages: allMessages[locale as keyof typeof allMessages]
  };
});
