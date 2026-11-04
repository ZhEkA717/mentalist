import {Component, inject, PLATFORM_ID} from '@angular/core';
import {HeaderComponent, HeaderItem} from "@modules/landing/components/header/header.component";
import {isPlatformBrowser, NgOptimizedImage} from "@angular/common";
import {WeddingHeroComponent} from '@modules/landing/components/wedding-hero/wedding-hero.component';
import {
  CombinationProgramComponent
} from '@modules/landing/components/combination-program/combination-program.component';
import {ContactsSectionComponent} from '@modules/landing/components/contacts/contacts.component';
import {FaqItem, FaqSectionComponent} from '@modules/landing/components/faq-section/faq-section.component';
import {FormatsComponent} from '@modules/landing/components/formats/formats.component';
import {MediaSectionComponent} from '@modules/landing/components/media/media.component';
import {ReviewsSectionComponent} from '@modules/landing/components/reviews-section/reviews-section.component';
import {ReviewCardData} from '@modules/landing/components/review-card/review-card.component';
import {WeddingAboutComponent} from '@modules/landing/components/wedding-about/wedding-about.component';

@Component({
  selector: 'app-wedding',
  imports: [
    HeaderComponent,
    NgOptimizedImage,
    WeddingHeroComponent,
    CombinationProgramComponent,
    ContactsSectionComponent,
    FaqSectionComponent,
    FormatsComponent,
    MediaSectionComponent,
    ReviewsSectionComponent,
    WeddingAboutComponent
  ],
  templateUrl: './wedding.component.html',
  styleUrl: './wedding.component.scss',
})
export class WeddingComponent {
  private platformId = inject(PLATFORM_ID);
  private setTimeoutIds: ReturnType<typeof setTimeout>[] = [];

  protected items: HeaderItem[] = [
    {label: 'Главная', route: '/'},
    {label: 'Свадьба', href: '#wedding', route: '/wedding'},
    {label: 'Форматы', href: '#formats'},
    {label: 'Отзывы', href: '#reviews'},
    {label: 'Медиа', href: '#media'},
    {label: 'Вопросы', href: '#faq'},
    {label: 'Контакты', href: '#contacts'},
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

  protected readonly faqItems: FaqItem[] = [
    {
      id: 'difference',
      question: 'Подойдёт ли шоу менталиста для гостей разных возрастов?',
      answer: 'Конечно! Ментализм интересен людям разных поколений, ведь удивление, ощущение чуда и желание прикоснуться к невозможному не зависят от возраста.\n' +
        'В программе сочетаются чтение мыслей, неожиданные предсказания, визуальные эффекты и живое взаимодействие с гостями. Интеллигентный юмор и интерактивная подача делают шоу одинаково увлекательным как для молодёжи, так и для старшего поколения.'
    },
    {
      id: 'guests',
      question: 'Как развлечь гостей на свадьбе во время welcome и перерывов?',
      answer:
      'Для этого отлично подходят два формата: welcome-ментализм и «Стол менталиста».\n' +
        'Во время welcome я перемещаюсь среди гостей, показывая психологические иллюзии небольшим компаниям. А «Стол менталиста» становится отдельной интерактивной зоной, куда гости могут подходить в удобное время.\n' +
        'Оба формата создают непринуждённую атмосферу, помогают гостям познакомиться, найти общие темы для разговора и наполняют ожидание яркими впечатлениями.'
    },
    {
      id: 'formats',
      question: ' Можно ли объединить несколько форматов шоу в одну свадебную программу?',
      answer:
      'Конечно! Помимо отдельных выступлений, можно выбрать комбинированную программу, объединяющую welcome-ментализм, «Стол менталиста» и сценическое шоу.\n' +
        'Это возможность с помощью одного артиста наполнить развлечениями сразу несколько этапов свадебного вечера: от встречи гостей и пауз между основными событиями до полноценного сценического выступления.\n' +
        'Программа выстраивается с учётом сценария свадьбы, чтобы каждый формат органично дополнял торжество.'
    },
    {
      id: 'personalization',
      question: 'Не будет ли гостям неловко участвовать в шоу?',
      answer:
      'Нет. Я уделяю особое внимание комфортному взаимодействию со зрителями. В программе нет унизительных розыгрышей, грубого юмора или ситуаций, в которых человек чувствует себя неуютно.\n' +
        'Гости могут участвовать непосредственно в номерах или наблюдать за происходящим со своих мест. Моя задача — подарить удивление и положительные эмоции, сохраняя атмосферу красивого свадебного праздника'
     },
    {
      id: 'booking',
      question: 'Можно ли сделать шоу персональным для молодожёнов?',
      answer:
        'Да! Я всегда подбираю программу с учётом сценария, атмосферы и особенностей конкретного мероприятия, чтобы выступление гармонично вписывалось в ваш праздник.\n' +
        'При желании мы можем обсудить дополнительную персонализацию: интегрировать в шоу историю знакомства, значимые даты, имена или другие детали, важные для молодожёнов. А для особенных пожеланий — разработать отдельные элементы программы специально под вашу свадьбу.'
    },
    {
      id: 'business',
      question: 'Сколько стоит шоу менталиста или фокусника на свадьбу?',
      answer:
        'Стоимость выступления зависит от выбранного формата, даты, города проведения и особенностей мероприятия.\n' +
        'Можно заказать отдельное сценическое шоу, welcome-программу, «Стол менталиста» или объединить несколько форматов в насыщенную программу свадебного вечера.\n' +
        'Расскажите о вашей свадьбе, количестве гостей и пожеланиях — я помогу подобрать подходящий формат и рассчитаю стоимость выступления.'
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
}
