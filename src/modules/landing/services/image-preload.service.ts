import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import type {ResponsiveAsset} from '../config/corporate-hero-assets';

@Injectable({providedIn: 'root'})
export class ImagePreloadService {
  private platformId = inject(PLATFORM_ID);
  private cache = new Set<string>();

  preload(urls: string | readonly string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const list = Array.isArray(urls) ? urls : [urls];
    for (const url of list) {
      if (!url || this.cache.has(url)) continue;
      this.cache.add(url);
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
    }
  }

  preloadResponsive(assets: readonly ResponsiveAsset[]): void {
    if (!isPlatformBrowser(this.platformId)) return;
    for (const asset of assets) {
      if (!asset.media) {
        this.preload(asset.url);
        return;
      }
      try {
        if (window.matchMedia(asset.media).matches) {
          this.preload(asset.url);
          return;
        }
      } catch {
        // некорректный media query — пропускаем
      }
    }
  }
}