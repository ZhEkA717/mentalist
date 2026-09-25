import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';

@Directive({
  selector: 'img[appSkeleton]',
  standalone: true,
})
export class ImageSkeletonDirective implements AfterViewInit {
  private readonly element = inject(ElementRef<HTMLImageElement>);

  @HostBinding('class.is-loaded') protected isLoaded = false;

  @HostListener('load')
  protected onLoad(): void {
    this.isLoaded = true;
  }

  ngAfterViewInit(): void {
    const img = this.element.nativeElement;
    if (img.complete && img.naturalWidth > 0) {
      this.isLoaded = true;
    }
  }
}