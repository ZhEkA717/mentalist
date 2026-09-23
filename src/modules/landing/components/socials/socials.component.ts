import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-socials',
  standalone: true,
  templateUrl: './socials.component.html',
  styleUrl: './socials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage
  ]
})
export class SocialsComponent {
  public elementRef: ElementRef<HTMLElement> = inject(ElementRef);
}
