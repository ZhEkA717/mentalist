import {environment} from '@environment/environment';
import {PageMetaConfig} from './meta-config.types';

export const corporateMetaConfig: PageMetaConfig = {
  title: 'Корпоративы с менталистом — Александр Шишук',
  description:
    'Шоу менталиста на корпоратив: индивидуальные программы для компаний, командные ивенты и праздники. Александр Шишук — менталист с 15+ летним стажем.',
  robots: 'index, follow',
  siteUrl: environment.baseUrl,
  path: '/corporate',
  og: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Александр Шишук — Менталист',
    title: 'Корпоративы с менталистом — Александр Шишук',
    description:
      'Шоу менталиста на корпоратив: индивидуальные программы для компаний, командные ивенты и праздники.',
    url: environment.baseUrl + '/corporate',
    image: environment.baseUrl + '/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Корпоративы с менталистом — Александр Шишук',
    description:
      'Шоу менталиста на корпоратив: индивидуальные программы для компаний, командные ивенты и праздники.',
    image: environment.baseUrl + '/og-image.jpg',
  },
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Корпоративное шоу менталиста',
      name: 'Шоу менталиста на корпоратив',
      description:
        'Интерактивное шоу психологических иллюзий для корпоративных мероприятий: чтение мыслей, предсказание решений и психологические эксперименты со зрителями.',
      provider: {
        '@id': environment.baseUrl + '/#person',
      },
      areaServed: ['Москва', 'Санкт-Петербург', 'Минск', 'Россия', 'Беларусь', 'Весь мир'],
      url: environment.baseUrl + '/corporate',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: environment.baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'Корпоратив', item: environment.baseUrl + '/corporate' },
      ],
    },
  ],
};
