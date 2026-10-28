import {ChangeDetectionStrategy, Component,} from '@angular/core';
import {NgOptimizedImage, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-corporate-about',
  standalone: true,
  templateUrl: './corporate-about.component.html',
  styleUrl: './corporate-about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
    NgTemplateOutlet
  ]
})
export class CorporateAboutSectionComponent {
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
