import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {HeaderComponent, HeaderItem} from '../../components/header/header.component';
import {CorporateHeroSectionComponent} from '../../components/corporate-hero/corporate-hero.component';
import {ContactsSectionComponent} from '../../components/contacts/contacts.component';
import {corporateMetaConfig} from '../../config/corporate-meta.config';
import {MediaSectionComponent} from '@modules/landing/components/media/media.component';
import {FaqItem, FaqSectionComponent} from '@modules/landing/components/faq-section/faq-section.component';
import {ReviewsSectionComponent} from '@modules/landing/components/reviews-section/reviews-section.component';
import {ReviewCardData} from '@modules/landing/components/review-card/review-card.component';

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
    ReviewsSectionComponent,
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

  protected readonly reviewsItems: ReviewCardData[] = [
    {
      type: 'review',
      value: {
        review:
          'У нас, к сожалению, нет ни одного видео с Вашим выступлением 😅 Гости были настолько поражены, что даже не возникло мысли взяться за телефон.\n' +
          'Как бы банально это ни звучало, но всё было «волшебно». Настолько круто, что даже немного страшно. У мамы вообще нервный срыв после Вашего выступления 😅\n' +
          'Огромное Вам спасибо! Вы были фурором нашей свадьбы, мы не ошиблись ни разу, пригласив Вас ❤️\n' +
          'Вы действительно Гарри Поттер 💫',
        name: 'Яна',
        photo: '/assets/images/reviews/review-1.webp',
      },
    },
    {
      type: 'review',
      value: {
        review:
          'Хочу ещё раз Вас поблагодарить!!! Шоу получилось просто супер! 👍 Все гости были в восторге, Вы реально удивили всех)) Мы до сих пор не понимаем, как Вы это делаете — такое ощущение, что Вы действительно читаете мысли 😄   Ваше шоу потом ещё два дня обсуждали)) Спасибо Вам огромное!!! ❤️❤️❤️ Удачи Вам в творчестве и ещё больше таких крутых выступлений!',
        name: 'Алена',
        photo: '/assets/images/reviews/review-2.webp',
      },
    },
    {
      type: 'review',
      value: {
        review:
          'Александр, хочу ещё раз сказать тебе огромное спасибо за выступление! Все гости были просто в восторге от шоу! Столько эмоций, столько разговоров потом было 😍 Ты получил просто кучу комплиментов, все спрашивали, как вообще такое возможно)) Было очень круто! Спасибо, что приехал и так удивил всех наших гостей ❤️🤝',
        name: 'Юлия',
        photo: '/assets/images/reviews/review-3.webp',
      },
    },
    {
      type: 'review',
      value: {
        review:
          'Добрый день, хотела бы ещё раз поблагодарить вас за наш день) Всё прошло супер, на следующий день ещё долго обсуждались ваше выступление)\n' +
          'Как вы могли угадать имя школьной подруги?! Вы оставили хороший след в нашем дне, благодарим 🙂',
        name: 'Анна',
        photo: '/assets/images/reviews/review-4.webp',
      },
    },
    {
      type: 'review',
      value: {
        review:
          'Я много разных артистов видела, но менталиста встретила впервые. И сегодня Саша меня просто поразил.\n' +
          'От некоторых вещей меня просто развалило в щепки 😳 \n' +
          'Я расплакалась, но даже не поняла почему. Гости тоже были в шоке))) Все потом обсуждали как вообще можно так читать людей и откуда он всё это знает.\n' +
          'Я такого раньше вообще не видела. Очень сильно.\n' +
          'Вот что значит, когда психолог на своем месте)))',
        name: 'Антонина',
        nameSubtitle: 'Организатор',
        photo: '/assets/images/reviews/review-5.webp',
      },
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
