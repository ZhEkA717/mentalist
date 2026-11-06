import {environment} from '@environment/environment';
import {PageMetaConfig} from './meta-config.types';

export const weddingMetaConfig: PageMetaConfig = {
  title: 'Свадебное шоу менталиста — Александр Шишук',
  description:
    'Шоу менталиста на свадьбу: интерактивная программа с чтением мыслей, предсказаниями и психологическими иллюзиями. Welcome-программа и сценическое шоу для молодожёнов и гостей.',
  robots: 'index, follow',
  siteUrl: environment.baseUrl,
  path: '/wedding',
  og: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Александр Шишук — Менталист',
    title: 'Свадебное шоу менталиста — Александр Шишук',
    description:
      'Интерактивное шоу менталиста на свадьбу: чтение мыслей, предсказания и психологические иллюзии для молодожёнов и гостей.',
    url: environment.baseUrl + '/wedding',
    image: environment.baseUrl + '/og-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Свадебное шоу менталиста — Александр Шишук',
    description:
      'Интерактивное шоу менталиста на свадьбу: чтение мыслей, предсказания и психологические иллюзии для молодожёнов и гостей.',
    image: environment.baseUrl + '/og-image.jpg',
  },
  structuredData: [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Шоу менталиста на свадьбу',
      name: 'Свадебное шоу менталиста',
      description:
        'Уникальное интерактивное шоу психологических иллюзий для свадебного торжества: гадания, предсказания, чтение мыслей молодожёнов и гостей.',
      provider: { '@id': environment.baseUrl + '/#person' },
      areaServed: ['Москва', 'Санкт-Петербург', 'Минск', 'Россия', 'Беларусь', 'Весь мир'],
      url: environment.baseUrl + '/wedding',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: environment.baseUrl + '/' },
        { '@type': 'ListItem', position: 2, name: 'Свадьба', item: environment.baseUrl + '/wedding' },
      ],
    },
  ],
};
