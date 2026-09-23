export interface SliderItem {
  '1900': string;
  '1200': string;
  '768': string;
  '520': string;
}

export interface SliderPictureSource {
  media: string;
  srcset: string;
}

export function sliderPictureSources(item: SliderItem): SliderPictureSource[] {
  return [
    {media: '(min-width: 1200px)', srcset: item['1900']},
    {media: '(min-width: 768px)', srcset: item['1200']},
    {media: '(min-width: 520px)', srcset: item['768']},
  ];
}