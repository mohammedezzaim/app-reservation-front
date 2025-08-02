import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  template: ''
})
export abstract class BaseCarouselComponent implements AfterViewInit, OnDestroy {
  protected isBrowser: boolean;
  protected runTimeOut!: ReturnType<typeof setTimeout>;
  protected runNextAuto!: ReturnType<typeof setTimeout>;

  constructor(
    protected renderer: Renderer2,
    protected el: ElementRef,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initializeCarousel();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.runTimeOut);
    clearTimeout(this.runNextAuto);
  }

  protected abstract initializeCarousel(): void;

  protected safeQuerySelector(selector: string): HTMLElement | null {
    return this.isBrowser ? this.el.nativeElement.querySelector(selector) : null;
  }

 protected safeQuerySelectorAll(selector: string): NodeListOf<HTMLElement> {
  if (!this.isBrowser) {
    // Return empty NodeList during SSR
    return document.createDocumentFragment().querySelectorAll(selector);
  }

  try {
    const elements = this.el.nativeElement.querySelectorAll(selector);
    return elements.length > 0 ? elements : this.createEmptyNodeList();
  } catch (error) {
    console.error('Query selector error:', error);
    return this.createEmptyNodeList();
  }
}

/** Creates an empty NodeList as fallback */
private createEmptyNodeList(): NodeListOf<HTMLElement> {
  return document.createDocumentFragment().querySelectorAll('*');
}
}
