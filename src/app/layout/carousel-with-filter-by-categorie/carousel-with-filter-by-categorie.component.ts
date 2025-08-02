import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Router } from "@angular/router";
import { BaseCarouselComponent } from '../../shared/components/base-carousel.component';

@Component({
  selector: 'app-carousel-with-filter-by-categorie',
  templateUrl: './carousel-with-filter-by-categorie.component.html',
  styleUrls: ['./carousel-with-filter-by-categorie.component.css']
})
export class CarouselWithFilterByCategorieComponent extends BaseCarouselComponent {

  constructor(
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    @Inject(PLATFORM_ID) protected override platformId: Object,
    private router: Router
  ) {
    super(renderer, el, platformId);
  }

  protected override initializeCarousel(): void {
    const imageList = this.safeQuerySelector(".slider-wrapper .image-list");
    const slideButtons = this.safeQuerySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = this.safeQuerySelector(".container .slider-scrollbar");

    if (!imageList || !slideButtons || !sliderScrollbar) return;

    slideButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', () => {
        const direction = button.id === "prev-slide" ? -1 : 1;
        const scrollAmount = imageList.clientWidth * direction;
        imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });

    this.renderer.listen(window, 'resize', () => {
      this.initializeCarousel();
    });
  }

  RedirectToFacture() {
    this.router.navigateByUrl("/reservationInformation");
  }
}
