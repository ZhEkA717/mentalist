export interface SliderItem {
  '1900': string;
  '1200': string;
  '768': string;
  '520': string;
}

export function sliderSrcset(item: SliderItem): string {
  return `${item['520']} 520w, ${item['768']} 768w, ${item['1200']} 1200w, ${item['1900']} 1900w`;
}