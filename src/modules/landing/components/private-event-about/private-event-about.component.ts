import { Component } from '@angular/core';
import {NgOptimizedImage, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-private-event-about',
    imports: [
        NgOptimizedImage,
        NgTemplateOutlet
    ],
  templateUrl: './private-event-about.component.html',
  styleUrl: './private-event-about.component.scss',
})
export class PrivateEventAboutComponent {
  protected readonly items = [
    {
      icon: '/assets/icons/star-icon.svg',
      text: 'современно\n' +
        'и стильно',
      width: 134,
      height: 134,

    },
    {
      icon: '/assets/icons/mask-icon.svg',
      text: 'интеллигентный \n' +
        'юмор',
      width: 116,
      height: 116,
    },
    {
      icon: '/assets/icons/peoples-icon.svg',
      text: 'подходит для \n' +
        'любой аудитории',
      width: 174,
      height: 137,
    },
    {
      icon: '/assets/icons/wine-glasses.svg',
      text: 'незабываемые \n' +
        'эмоции',
      width: 134,
      height: 134,
    },
  ]
}
