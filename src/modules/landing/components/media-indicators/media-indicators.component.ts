import { ChangeDetectionStrategy, Component, input, InputSignal, model, ModelSignal, output, Pipe, PipeTransform } from '@angular/core';

export type TSitUiSize = 'sm' | 'md' | 'lg';

export type TIndicatorsPageChangeEvent = {
  event: MouseEvent;
  page: number;
};

@Pipe({
  name: 'sitUiPreLastSeen',
  standalone: true,
})
export class SitUiPreLastSeenPipe implements PipeTransform {
  transform(index: number, offset: number, fullLength: number, maxDotsLength: number): boolean {
    const isWrapping = fullLength > maxDotsLength;
    const isStartPreLastSeen = offset > 0 && index === offset + 1;
    const isEndPreLastSeen = index === maxDotsLength + offset - 2 && index < fullLength - 2;

    return isWrapping && (isStartPreLastSeen || isEndPreLastSeen);
  }
}

@Pipe({
  name: 'sitUiLastSeen',
  standalone: true,
})
export class SitUiLastSeenPipe implements PipeTransform {
  transform(index: number, offset: number, fullLength: number, maxDotsLength: number): boolean {
    const isWrapping = fullLength > maxDotsLength;
    const isStartLastSeen = offset > 0 && index <= offset;
    const isEndLastSeen = index >= maxDotsLength + offset - 1 && index < fullLength - 1;

    return isWrapping && (isStartLastSeen || isEndLastSeen);
  }
}

@Component({
  selector: 'app-media-indicators',
  templateUrl: './media-indicators.component.html',
  styleUrls: ['./media-indicators.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SitUiPreLastSeenPipe, SitUiLastSeenPipe],
})
export class MediaIndicatorsComponent {
  page: ModelSignal<number> = model(0);
  fullLength: InputSignal<number> = input(1);
  maxDotsLength: InputSignal<number> = input(6);
  disabled: InputSignal<boolean> = input(false);
  size: InputSignal<TSitUiSize> = input<TSitUiSize>('md');

  onPageChange = output<TIndicatorsPageChangeEvent>();

  get visibleDotLength(): number {
    return Math.min(this.fullLength(), this.maxDotsLength());
  }
  get offset(): number {
    const centerPos = Math.floor(this.visibleDotLength / 2);
    if (this.page() < centerPos) {
      return 0;
    } else if (this.page() < this.fullLength() - centerPos) {
      return this.page() - 2;
    } else {
      return this.fullLength() - centerPos - 3;
    }
  }
  onPageSelect(event: MouseEvent, page: number) {
    if (!this.disabled()) {
      this.page.set(page);
      this.onPageChange.emit({ event, page });
    }
  }
}
