import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export interface ReviewData {
  review: string;
  name: string;
  photo: string;
  nameSubtitle?: string;
}

export type ReviewCardData =
  | {type: 'review'; value: ReviewData}
  | {type: 'video'; value: string; poster?: string};

const DEFAULT_VIDEO_POSTER = '/assets/images/reviews/review-video.webp';

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
  loading = input<boolean>(false);
  videoOpen = output<string>();

  protected readonly reviewData = computed<ReviewData | null>(() => {
    const d = this.data();
    return d.type === 'review' ? d.value : null;
  });

  protected readonly isVideo = computed(() => this.data().type === 'video');

  protected readonly videoUrl = computed<string | null>(() => {
    const d = this.data();
    return d.type === 'video' ? d.value : null;
  });

  protected readonly posterUrl = computed<string>(() => {
    const d = this.data();
    if (d.type !== 'video') return DEFAULT_VIDEO_POSTER;
    return d.poster ?? DEFAULT_VIDEO_POSTER;
  });

  protected onVideoClick(): void {
    const url = this.videoUrl();
    if (url) this.videoOpen.emit(url);
  }
}
