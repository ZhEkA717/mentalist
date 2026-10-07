import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {HeaderComponent, HeaderItem} from '../../components/header/header.component';
import {CorporateHeroSectionComponent} from '../../components/corporate-hero/corporate-hero.component';
import {ContactsSectionComponent} from '../../components/contacts/contacts.component';
import {corporateMetaConfig} from '../../config/corporate-meta.config';
import {MediaSectionComponent} from '@modules/landing/components/media/media.component';
import {FaqItem, FaqSectionComponent} from '@modules/landing/components/faq-section/faq-section.component';

@Component({
  selector: 'app-corporate',
  standalone: true,
  templateUrl: './corporate.component.html',
  styleUrl: './corporate.component.scss',
  imports: [
    HeaderComponent,
    CorporateHeroSectionComponent,
    ContactsSectionComponent,
    MediaSectionComponent,
    FaqSectionComponent,
    NgOptimizedImage,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];

  protected items: HeaderItem[] = [
    {label: 'Главная', route: '/'},
    {label: 'Корпоратив', href: '#corporate', route: '/corporate'},
    {label: 'Форматы', href: '#formats'},
    {label: 'Отзывы', href: '#reviews'},
    {label: 'Медиа', href: '#media'},
    {label: 'Вопросы', href: '#faq'},
    {label: 'Контакты', href: '#contacts'},
  ];

  protected readonly faqItems: FaqItem[] = [
    {
      id: 'who',
      question: 'Кто такой Александр Шишук?',
      answer:
        'Александр Шишук — менталист, психологический иллюзионист и дипломированный психолог, один из лучших представителей современного ментализма в России и Беларуси. Более 15 лет выступает на сцене, создаёт авторские интерактивные шоу и выступает на международных фестивалях.',
    },
    {
      id: 'difference',
      question: 'Чем менталист отличается от фокусника и иллюзиониста?',
      answer:
        'Фокусник или иллюзионист преимущественно удивляет зрителей визуальными эффектами и иллюзиями. В шоу менталиста главным объектом становятся мысли, решения, воспоминания и выборы зрителей. Александр Шишук объединяет современный ментализм, психологические иллюзии, чтение мыслей, предсказания и визуальные эффекты.',
    },
    {
      id: 'events',
      question: 'На какие мероприятия можно заказать Александра Шишука?',
      answer:
        'Выступление Александра Шишука можно заказать на корпоратив, свадьбу, частное мероприятие, юбилей, презентацию, конференцию, форум и другое событие. Для разных мероприятий подбирается подходящий формат: сценическое шоу, welcome-программа, стол менталиста или комбинированная программа.',
    },
    {
      id: 'corporate',
      question: 'Можно ли заказать менталиста на корпоратив?',
      answer:
        'Да. Иллюзионно-ментальное шоу Александра Шишука подходит для корпоративов, мероприятий компаний, праздничных вечеров, презентаций и деловых событий. Программа адаптируется под аудиторию, формат и особенности мероприятия.',
    },
    {
      id: 'wedding',
      question: 'Можно ли заказать менталиста или фокусника на свадьбу?',
      answer:
        'Да. На свадьбу можно заказать сценическое шоу менталиста, welcome-программу или комбинированный формат. Программа Александра Шишука сочетает чтение мыслей, предсказания, психологические иллюзии, визуальные эффекты и живой интерактив с гостями.',
    },
    {
      id: 'cities',
      question: 'В каких городах выступает Александр Шишук?',
      answer:
        'Александр Шишук регулярно выступает в Москве, Санкт-Петербурге и Минске, а также выезжает на мероприятия в другие города России, Беларуси и других стран.',
    },
    {
      id: 'duration',
      question: 'Сколько длится шоу менталиста?',
      answer:
        'Продолжительность зависит от выбранного формата. Сценическое шоу длится около 25–30 минут, а welcome-программа, стол менталиста и комбинированные программы позволяют выстроить развлекательную программу на более продолжительную часть мероприятия.',
    },
    {
      id: 'guests',
      question: 'На какое количество гостей рассчитано шоу менталиста?',
      answer:
        'Ментализм подходит как для камерных мероприятий, так и для больших залов. Формат выступления и способы взаимодействия со зрителями подбираются с учётом количества гостей, площадки и сценария мероприятия.',
    },
    {
      id: 'lecture',
      question: 'Можно ли пригласить Александра Шишука с лекцией или шоу-лекцией?',
      answer:
        'Да. Александр Шишук проводит лекции и интерактивные шоу-лекции, объединяющие психологию, когнитивные эффекты, ментализм и сценические эксперименты. Формат подходит для компаний, конференций, фестивалей и образовательных мероприятий.',
    },
  ];

  constructor() {
    this.title.setTitle(corporateMetaConfig.title);
  }

  protected onSectionClick(id: string, block: ScrollLogicalPosition = 'start', offset = 0): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.setTimeoutIds.push(setTimeout(() => {
      this.scrollToSection(id, block, offset);
    }));
  }

  private scrollToSection(id: string, block: ScrollLogicalPosition, offset: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const tryScroll = (): boolean => {
      const el = document.getElementById(id);
      if (!el) return false;
      if (offset) {
        const y = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top: y, behavior: 'smooth'});
      } else {
        el.scrollIntoView({behavior: 'smooth', block});
      }
      return true;
    };

    if (tryScroll()) return;

    let attempts = 0;
    const retry = (): void => {
      if (tryScroll() || ++attempts > 40) return;
      const t = setTimeout(retry, 50);
      this.setTimeoutIds.push(t);
    };
    const t = setTimeout(retry, 50);
    this.setTimeoutIds.push(t);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  ngOnDestroy(): void {
    this.setTimeoutIds.forEach(id => clearTimeout(id));
  }
}
