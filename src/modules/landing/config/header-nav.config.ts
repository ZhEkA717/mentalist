import type {HeaderItem} from '../components/header/header.component';

export type HeaderSectionRoute = '/' | '/corporate' | '/wedding' | '/private-event';

const SECTIONS: readonly HeaderItem[] = [
  {label: 'Выступления', route: '/', href: '#shows', offset: 100, back: true},
  {label: 'Корпоратив', route: '/corporate', href: '#corporate'},
  {label: 'Свадьба', route: '/wedding', href: '#wedding'},
  {label: 'Частное мероприятие', route: '/private-event', href: '#private-event'},
];

/**
 * Subitems for the section dropdown in the header: every section except the
 * current one. "Выступления" (the main page) gets a back arrow.
 */
export function headerSectionChildren(current: HeaderSectionRoute): HeaderItem[] {
  return SECTIONS.filter((section) => section.route !== current).map((section) => ({...section}));
}
