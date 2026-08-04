import {AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnDestroy, signal, viewChild, viewChildren} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {AppWheelSmithDirective} from '../../../../shared/app-wheel-smith.directive';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initRevealOnScroll} from '../../utils/scroll-animations';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CarouselComponent, AppWheelSmithDirective],
  templateUrl: './media.component.html',
  styleUrl: './media.component.scss',
})
export class MediaSectionComponent implements AfterViewInit, OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly isRuDomain = this.activatedRoute.snapshot.queryParams['ru'] || window.location.hostname.endsWith('.ru');
  private readonly el = inject(ElementRef);

  protected videoContainers = viewChildren<ElementRef<HTMLElement>>('videoContainer');
  protected videosSection = viewChild<ElementRef<HTMLElement>>('videosSection');

  private readonly videoUrls: Array<{youtube: string; vk: string}> = [
    {youtube: 'https://www.youtube.com/embed/sNIPgihatyU', vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239035&hash=9ae4ca3a7f22cc57&hd=4'},
    {youtube: 'https://www.youtube.com/embed/X3jvY2xpmfc', vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239034&hash=69a23c2952842a28&hd=4'},
    {youtube: 'https://www.youtube.com/embed/YulDfOQiDk8', vk: 'https://vkvideo.ru/video_ext.php?oid=-65614643&id=456239036&hash=26ddd6f8d47e1ba1&hd=4'},
  ];

  protected readonly videos = computed(() =>
    this.videoUrls.map(v => this.sanitizer.bypassSecurityTrustResourceUrl(this.isRuDomain ? v.vk : v.youtube)),
  );

  protected sliderItems = [
    'assets/images/IMG_1.png',
    'assets/images/IMG_2.png',
    'assets/images/IMG_3.png',
    'assets/images/IMG_4.png',
    'assets/images/IMG_5.png',
    'assets/images/IMG_6.png',
    'assets/images/IMG_7.png',
    'assets/images/IMG_8.png',
    'assets/images/IMG_9.png',
    'assets/images/IMG_10.png',
    'assets/images/IMG_11.png',
    'assets/images/IMG_12.png',
    'assets/images/IMG_13.png',
    'assets/images/IMG_14.png',
    'assets/images/IMG_15.png',
    'assets/images/IMG_16.png',
  ];

  ngAfterViewInit(): void {
    initRevealOnScroll(this.el.nativeElement);
    setTimeout(() => this.initScrollToSecondVideo(), 2200);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf(this.el.nativeElement.querySelectorAll('.reveal-on-scroll'));
  }

  private initScrollToSecondVideo(): void {
    const el = this.videosSection()?.nativeElement;
    if (!el) return;

    let triggered = false;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 100%',
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        this.scrollToSecondVideo();
      },
    });
  }

  private scrollToSecondVideo(): void {
    const containers = this.videoContainers();
    if (containers.length < 2) return;
    const el = containers[1].nativeElement;
    const parent = el.parentElement;
    if (!parent) return;
    const offset = el.offsetLeft - (parent.clientWidth - el.offsetWidth) / 2 - 48;
    parent.scrollTo({left: offset, behavior: 'smooth'});
  }
}
