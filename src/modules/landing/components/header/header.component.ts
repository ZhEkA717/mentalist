import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  items = input.required<{ label: string; href: string }[]>();
  sectionClick = output<string>();

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    this.sectionClick.emit(id);
  }
}
