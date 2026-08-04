import {AfterViewInit, Component} from '@angular/core';
import {AppWheelSmithDirective} from '../../../../shared/app-wheel-smith.directive';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-promo-show',
  standalone: true,
  imports: [AppWheelSmithDirective],
  templateUrl: './promo-show.component.html',
  styleUrls: ['./promo-show.component.scss']
})
export class PromoShowSectionComponent implements AfterViewInit {
  protected cards = [
    {
      id: 1,
      img: 'assets/images/card_1.webp',
      title: 'Корпоративные мероприятия',
      description: 'Современное шоу для корпоративных мероприятий, компаний, деловых встреч, презентаций и специальных событий.'
    },
    {
      id: 2,
      img: 'assets/images/card_2.webp',
      title: 'Свадьбы',
      description: 'Эмоциональное шоу, которое объединяет гостей, вовлекает молодоженов и делает свадебное событие по-настоящему запоминающимся.'
    },
    {
      id: 3,
      img: 'assets/images/card_3.webp',
      title: 'Частные мероприятия',
      description: 'Формат для дней рождения, юбилеев, закрытых вечеров, семейных праздников и других частных событий.'
    },
  ];

  ngAfterViewInit(): void {
    setTimeout(() => this.initCardFlip(), 2200);
  }

  private initCardFlip(): void {
    gsap.utils.toArray<HTMLElement>('.show__content__item').forEach((card) => {
      const inner = card.querySelector('.card-inner') as HTMLElement;
      if (!inner) return;

      gsap.set(inner, {rotateY: 180});

      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to(inner, {rotateY: 0, duration: 0.8, ease: 'power2.inOut'}),
        onLeave: () => gsap.to(inner, {rotateY: 180, duration: 0.8, ease: 'power2.inOut'}),
        onEnterBack: () => gsap.to(inner, {rotateY: 0, duration: 0.8, ease: 'power2.inOut'}),
        onLeaveBack: () => gsap.to(inner, {rotateY: 180, duration: 0.8, ease: 'power2.inOut'}),
      });
    });
  }
}
