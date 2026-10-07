import {ChangeDetectionStrategy, Component, input, model} from '@angular/core';

@Component({
  selector: 'app-question-accordion',
  imports: [],
  templateUrl: './question-accordion.component.html',
  styleUrl: './question-accordion.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionAccordionComponent {
  question = input.required<string>();
  answer = input.required<string>();
  expanded = model<boolean>(false);

  protected toggle(): void {
    this.expanded.update(v => !v);
  }
}