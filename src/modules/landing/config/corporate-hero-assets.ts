export interface ResponsiveAsset {
  readonly media?: string;
  readonly url: string;
}

export const CORPORATE_HERO_BACKGROUNDS: readonly ResponsiveAsset[] = [
  {media: '(max-width: 520px)', url: '/assets/images/background-corporate-hero-520.webp'},
  {media: '(max-width: 768px)', url: '/assets/images/background-corporate-hero-768.webp'},
  {url: '/assets/images/background-corporate-hero.webp'},
];

export const CORPORATE_HERO_CHARACTERS: readonly ResponsiveAsset[] = [
  {media: '(max-width: 768px)', url: '/assets/images/corporate-hero-768.webp'},
  {url: '/assets/images/corporate-hero.webp'},
];