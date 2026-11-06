import {environment} from '@environment/environment';
import {PageMetaConfig} from './meta-config.types';

export const privateEventMetaConfig: PageMetaConfig = {
  title: 'Шоу менталиста на частное мероприятие — Александр Шишук',
  description:
    'Шоу менталиста на день рождения, юбилей и частный праздник: интерактивная программа с чтением мыслей, предсказаниями и психологическими иллюзиями. Индивидуальный сценарий под ваших гостей.',
  robots: 'index, follow',
  siteUrl: environment.baseUrl,
  path: '/private-event',
  og: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Александр Шишук — Менталист',
    title: 'Шоу менталиста на частное мероприятие — Александр Шишук',
    description:
      'Интерактивное шоу менталиста на день рождения, юбилей и частный праздник: чтение мыслей, предсказания и психологические иллюзии.',
    url: environment.baseUrl + '/private-event',
    image: environment.baseUrl + '/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Шоу менталиста на частное мероприятие — Александр Шишук',
    description:
      'Интерактивное шоу менталиста на день рождения, юбилей и частный праздник: чтение мыслей, предсказания и психологические иллюзии.',
    image: environment.baseUrl + '/og-image.jpg',
  },
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Шоу на частные мероприятия',
      name: 'Шоу менталиста на день рождения и юбилей',
      description:
        'Интерактивное шоу психологических иллюзий для частных праздников: день рождения, юбилей, корпоратив частный. Индивидуальный сценарий под аудиторию гостей.',
      provider: { '@id': environment.baseUrl + '/#person' },
      areaServed: ['Москва', 'Санкт-Петербург', 'Минск', 'Россия', 'Беларусь', 'Весь мир'],
      url: environment.baseUrl + '/private-event',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: environment.baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'Частное мероприятие', item: environment.baseUrl + '/private-event' },
      ],
    },
  ],
};
