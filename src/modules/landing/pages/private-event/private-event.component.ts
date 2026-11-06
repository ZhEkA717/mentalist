import {AfterViewInit, Component, inject, OnDestroy, PLATFORM_ID} from '@angular/core';
import {
  CombinationProgramComponent
} from "@modules/landing/components/combination-program/combination-program.component";
import {ContactsSectionComponent} from "@modules/landing/components/contacts/contacts.component";
import {FaqItem, FaqSectionComponent} from "@modules/landing/components/faq-section/faq-section.component";
import {FormatsComponent} from "@modules/landing/components/formats/formats.component";
import {HeaderComponent, HeaderItem} from "@modules/landing/components/header/header.component";
import {MediaSectionComponent} from "@modules/landing/components/media/media.component";
import {isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {ReviewsSectionComponent} from "@modules/landing/components/reviews-section/reviews-section.component";
import {privateEventMetaConfig} from '@modules/landing/config/private-event-meta.config';
import {SeoService} from '@modules/landing/services/seo.service';
import {ReviewCardData} from '@modules/landing/components/review-card/review-card.component';
import {PrivateEventHeroComponent} from '@modules/landing/components/private-event-hero/private-event-hero.component';
import {
  PrivateEventAboutComponent
} from '@modules/landing/components/private-event-about/private-event-about.component';

@Component({
  selector: 'app-private-event',
  providers: [SeoService],
  imports: [
    CombinationProgramComponent,
    ContactsSectionComponent,
    FaqSectionComponent,
    FormatsComponent,
    HeaderComponent,
    MediaSectionComponent,
    NgOptimizedImage,
    ReviewsSectionComponent,
    PrivateEventHeroComponent,
    PrivateEventAboutComponent
  ],
  templateUrl: './private-event.component.html',
  styleUrl: './private-event.component.scss',
})
export class PrivateEventComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    inject(SeoService).apply(privateEventMetaConfig);
  }

  protected items: HeaderItem[] = [
    {label: 'Главная', route: '/'},
    {label: 'Частное меропритие', href: '#private-event', route: '/private-event'},
    {label: 'Форматы', href: '#formats'},
    {label: 'Отзывы', href: '#reviews'},
    {label: 'Медиа', href: '#media'},
    {label: 'Вопросы', href: '#faq'},
    {label: 'Контакты', href: '#contacts'},
  ];

  protected readonly faqItems: FaqItem[] = [
    {
      id: 'birthday',
      question: 'Подойдёт ли шоу менталиста для дня рождения или юбилея?',
      answer:
        'Конечно! Ментализм отлично подходит для дней рождения, юбилеев, частных вечеринок и других торжеств. В программе сочетаются чтение мыслей, неожиданные предсказания, визуальные эффекты и живое взаимодействие с гостями.\n\nВ отличие от привычного шоу фокусника, здесь в центре внимания оказываются сами зрители — их мысли, решения и воспоминания. Благодаря этому выступление становится более личным и запоминающимся.',
    },
    {
      id: 'ages',
      question: 'Будет ли шоу интересно гостям разных возрастов?',
      answer:
        'Да! Удивление и ощущение чуда не зависят от возраста. Ментализм одинаково увлекает как молодёжь, так и старшее поколение.\n\nИнтеллигентный юмор, зрелищные иллюзии и интерактивная подача делают программу понятной и интересной для гостей с разными вкусами. При подготовке я учитываю состав аудитории, чтобы каждый чувствовал себя комфортно.',
    },
    {
      id: 'small-company',
      question: 'Можно ли провести шоу для небольшой компании гостей?',
      answer:
        'Да. Ментализм прекрасно работает как в камерной обстановке, так и перед большим залом. Для небольших компаний можно выбрать сценическое выступление или более личный формат — «Стол менталиста», где чудеса происходят буквально на расстоянии вытянутой руки.\n\nПрограмма подбирается с учётом количества гостей, особенностей площадки и атмосферы вашего праздника.',
    },
    {
      id: 'personalization',
      question: 'Можно ли сделать выступление персональным для именинника или юбиляра?',
      answer:
        'Конечно! Я всегда адаптирую программу под повод, атмосферу и особенности мероприятия.\n\nПри желании мы можем добавить в выступление персональные элементы: значимые даты, воспоминания, имена или события из жизни виновника торжества. Это позволяет сделать шоу не просто развлечением, а особенным моментом праздника.',
    },
    {
      id: 'combination',
      question: 'Можно ли объединить несколько форматов шоу в одну программу?',
      answer:
        'Конечно! Помимо отдельных выступлений, можно выбрать комбинированную программу, объединяющую welcome-ментализм, «Стол менталиста» и сценическое шоу.\n\nЭто возможность с помощью одного артиста наполнить развлечениями сразу несколько этапов вашего праздника: от встречи гостей и общения за столами до полноценного сценического выступления.\n\nПрограмма подбирается с учётом сценария мероприятия, количества гостей и ваших пожеланий, чтобы каждый формат органично дополнял праздник.',
    },
    {
      id: 'price',
      question: 'Сколько стоит заказать шоу менталиста или фокусника на частный праздник?',
      answer:
        'Стоимость выступления зависит от выбранного формата, даты, города проведения, количества гостей и особенностей мероприятия.\n\nМожно заказать отдельное сценическое шоу, welcome-программу, «Стол менталиста» или объединить несколько форматов в одну программу.\nРасскажите о вашем празднике и пожеланиях — я помогу подобрать подходящий вариант и рассчитаю стоимость выступления.',
    },
  ];

  protected readonly reviewsItems: ReviewCardData[] = [
    {
      type: 'video',
      value: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239037&hash=7d82af301a8d9bce&hd=4',
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
