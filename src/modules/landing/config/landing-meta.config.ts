import {environment} from '@environment/environment';
import {PageMetaConfig} from './meta-config.types';

export const landingMetaConfig: PageMetaConfig = {
  title: 'Александр Шишук — менталист, психологический иллюзионист',
  description:
    'Александр Шишук — один из лучших менталистов России и Беларуси, психологический иллюзионист. Более 15 лет на сцене, дипломированный психолог, автор интерактивных шоу и спикер международных фестивалей.',
  robots: 'index, follow',
  siteUrl: environment.baseUrl,
  path: '',
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
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: environment.baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'О менталисте', item: environment.baseUrl + '/#about' },
        { '@type': 'ListItem', position: 3, name: 'Шоу на корпоратив', item: environment.baseUrl + '/#shows' },
        { '@type': 'ListItem', position: 4, name: 'Медиа', item: environment.baseUrl + '/#media' },
        { '@type': 'ListItem', position: 5, name: 'Контакты', item: environment.baseUrl + '/#contacts' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Шоу психологических иллюзий на корпоратив',
      name: 'Шоу менталиста на корпоратив',
      description:
        'Интерактивное шоу психологических иллюзий для корпоративных мероприятий: чтение мыслей, предсказание решений, психологические эксперименты со зрителями.',
      provider: { '@id': environment.baseUrl + '/#person' },
      areaServed: ['Москва', 'Санкт-Петербург', 'Минск', 'Россия', 'Беларусь', 'Весь мир'],
      url: environment.baseUrl + '/#shows',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Шоу менталиста на свадьбу',
      name: 'Свадебное шоу менталиста',
      description:
        'Уникальное интерактивное шоу психологических иллюзий для свадебного торжества: гадания, предсказания, чтение мыслей молодожёнов и гостей.',
      provider: { '@id': environment.baseUrl + '/#person' },
      areaServed: ['Москва', 'Санкт-Петербург', 'Минск', 'Россия', 'Беларусь', 'Весь мир'],
      url: environment.baseUrl + '/#shows',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Шоу на частные мероприятия',
      name: 'Шоу менталиста на день рождения и юбилей',
      description:
        'Интерактивное шоу психологических иллюзий для частных праздников: день рождения, юбилей, корпоратив частный. Индивидуальный сценарий под аудиторию гостей.',
      provider: { '@id': environment.baseUrl + '/#person' },
      areaServed: ['Москва', 'Санкт-Петербург', 'Минск', 'Россия', 'Беларусь', 'Весь мир'],
      url: environment.baseUrl + '/#shows',
    },
  ],
};
