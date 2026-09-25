import {environment} from '@environment/environment';

export interface LandingMetaConfig {
  title: string;
  description: string;
  robots: string;
  siteUrl: string;
  canonical: string;
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

export const landingMetaConfig: LandingMetaConfig = {
  title: 'Александр Шишук — менталист, психологический иллюзионист',
  description:
    'Александр Шишук — один из лучших менталистов России и Беларуси, психологический иллюзионист. Более 15 лет на сцене, дипломированный психолог, автор интерактивных шоу и спикер международных фестивалей.',
  robots: 'index, follow',
  siteUrl: environment.baseUrl,
  canonical: environment.baseUrl,
  og: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Александр Шишук — Менталист',
    title: 'Александр Шишук — менталист, психологический иллюзионист',
    description:
      'Менталист Александр Шишук — шоу психологических иллюзий на корпоратив, свадьбу и частные мероприятия. Более 15 лет опыта.',
    url: environment.baseUrl,
    image: environment.baseUrl + '/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Александр Шишук — Менталист | Шоу психологических иллюзий',
    description:
      'Менталист Александр Шишук — шоу психологических иллюзий на корпоратив, свадьбу и частные мероприятия.',
    image: environment.baseUrl + '/og-image.jpg',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Александр Шишук',
    alternateName: 'Менталист Александр Шишук',
    description:
      'Менталист, психологический иллюзионист, дипломированный психолог, гипнотизёр. Более 15 лет опыта выступлений.',
    url: environment.baseUrl,
    image: environment.baseUrl +'/og-image.jpg',
    jobTitle: 'Менталист',
    telephone: ['+7 (915) 442-28-54', '+375 (29) 857-60-57'],
    email: 'alex.mentalist@yandex.by',
    sameAs: [
      'https://t.me/alex_shishuk',
      'https://youtube.com/@alex.shishuk',
      'https://vk.ru/alex.shishuk',
    ],
  },
};
