import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-corporate-hero',
  standalone: true,
  templateUrl: './corporate-hero.component.html',
  styleUrl: './corporate-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateHeroSectionComponent {}