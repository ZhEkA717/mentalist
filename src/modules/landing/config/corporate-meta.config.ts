import {environment} from '@environment/environment';

export interface CorporateMetaConfig {
  title: string;
  description: string;
  robots: string;
  siteUrl: string;
  og: {
    type: string;
    locale: string;
    siteName: string;
    title: string;
    description: string;
    url: string;
    image: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  structuredData: Record<string, unknown>;
}

export const corporateMetaConfig: CorporateMetaConfig = {
  title: 'Корпоративы с менталистом — Александр Шишук',
  description:
    'Шоу менталиста на корпоратив: индивидуальные программы для компаний, командные ивенты и праздники. Александр Шишук — менталист с 15+ летним стажем.',
  robots: 'index, follow',
  siteUrl: environment.baseUrl,
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
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Корпоративное шоу менталиста',
    provider: {
      '@type': 'Person',
      name: 'Александр Шишук',
      telephone: ['+7 (915) 442-28-54', '+375 (29) 857-60-57'],
      email: 'alex.mentalist@yandex.by',
    },
    areaServed: ['RU', 'BY'],
    url: environment.baseUrl + '/corporate',
  },
};