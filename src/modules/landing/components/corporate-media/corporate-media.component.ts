import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-corporate-media',
  standalone: true,
  templateUrl: './corporate-media.component.html',
  styleUrl: './corporate-media.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateMediaSectionComponent {}