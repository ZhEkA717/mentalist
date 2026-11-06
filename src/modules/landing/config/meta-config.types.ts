export interface PageMetaConfig {
  title: string;
  description: string;
  robots: string;
  siteUrl: string;
  path: string;
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
  structuredData: Array<Record<string, unknown>>;
}
