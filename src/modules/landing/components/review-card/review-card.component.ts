import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';

export interface ReviewData {
  review: string;
  name: string;
  photo: string;
  nameSubtitle?: string;
}

export type ReviewCardData =
  | {type: 'review'; value: ReviewData}
  | {type: 'video'; value: string};

@Component({
  selector: 'app-review-card',
  imports: [],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCardComponent {
  data = input.required<ReviewCardData>();

  protected readonly reviewData = computed<ReviewData | null>(() => {
    const d = this.data();
    return d.type === 'review' ? d.value : null;
  });

  protected readonly videoSrc = computed<string | null>(() => {
    const d = this.data();
    return d.type === 'video' ? d.value : null;
  });
}
