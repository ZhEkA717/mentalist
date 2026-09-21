import {ChangeDetectionStrategy, Component, ElementRef, inject} from '@angular/core';

@Component({
  selector: 'app-socials',
  standalone: true,
  templateUrl: './socials.component.html',
  styleUrl: './socials.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialsComponent {
  public elementRef: ElementRef<HTMLElement> = inject(ElementRef);
}
