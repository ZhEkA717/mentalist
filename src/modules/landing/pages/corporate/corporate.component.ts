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
      id: 'difference',
      question: 'Чем шоу менталиста отличается от шоу фокусника?',
      answer:
        'Фокусник удивляет преимущественно визуальными эффектами, иллюзиями и ловкостью рук. В шоу менталиста главным объектом становятся сами зрители — их мысли, решения, воспоминания и выборы. Я соединяю ментализм, психологические техники и визуальные эффекты, поэтому происходящее воспринимается гораздо более лично: ведь мысли каждого человека уникальны.',
    },
    {
      id: 'price',
      question: 'Сколько стоит шоу менталиста на корпоратив?',
      answer:
        'Стоимость выступления зависит от выбранной программы, даты, города, количества гостей и особенностей мероприятия. Можно выбрать один формат или объединить несколько в насыщенную программу вечера. Свяжитесь со мной, чтобы узнать стоимость выступления для вашего корпоратива.',
    },
    {
      id: 'guests',
      question: 'На какое количество гостей рассчитано шоу?',
      answer:
        'Ментализм может работать как для одного человека, так и для аудитории в несколько тысяч зрителей. Для камерного мероприятия, welcome-зоны и большого корпоратива используются разные форматы и способы взаимодействия с гостями. Расскажите о вашем мероприятии — я помогу подобрать подходящий вариант программы.',
    },
    {
      id: 'personalization',
      question: 'Можно ли персонализировать шоу под нашу компанию?',
      answer:
        'Да. Каждое выступление адаптируется под аудиторию, формат и особенности конкретного мероприятия. В программу можно интегрировать информацию о компании, поводе или тематике события, а при необходимости — разработать отдельные элементы и уникальную программу специально под ваш запрос.',
    },
    {
      id: 'booking',
      question: 'Насколько заранее нужно бронировать выступление?',
      answer:
        'Чем раньше, тем лучше: особенно если мероприятие проходит в популярную дату или в высокий корпоративный сезон. Некоторые даты могут быть заняты уже за месяц и более, поэтому лучше заранее уточнить доступность дня, даже если программа мероприятия ещё окончательно не утверждена.',
    },
    {
      id: 'business',
      question: 'Можно ли заказать шоу на деловое мероприятие или презентацию компании?',
      answer:
        'Да. Формат можно адаптировать под конференцию, презентацию, форум или другое деловое мероприятие. Ментализм можно использовать как самостоятельное шоу, необычный способ презентации продукта или интегрировать в шоу-лекцию, объединяющую психологию, интерактив и развлекательную программу.',
    },
  ];

  protected readonly reviewsItems: ReviewCardData[] = [
    {
      type: 'video',
      value: 'https://vk.com/video_ext.php?oid=-65614643&id=456239031',
    },
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
