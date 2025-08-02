import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../security/serviceAuth/auth.service";
import { VoitureService } from "../../sahred/service/voitureService/voiture.service";
import { Voiture } from "../../sahred/model/voitureModel/voiture.model";
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BaseCarouselComponent } from '../../shared/components/base-carousel.component';

@Component({
  selector: 'app-carousel-test',
  templateUrl: './carousel-test.component.html',
  styleUrls: ['./carousel-test.component.css']
})
export class CarouselTestComponent extends BaseCarouselComponent {
  public dataVoiture: Array<Voiture> = [];

  constructor(
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    @Inject(PLATFORM_ID) protected override platformId: Object,
    private authService: AuthService,
    private voitureservice: VoitureService,
    private router: Router
  ) {
    super(renderer, el, platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.getAll();
    }
  }

  protected override initializeCarousel(): void {
    this.initSlider();
  }

  private getAll() {
    this.voitureservice.getAll().subscribe({
      next: (data) => {
        if (data) {
          this.dataVoiture = data;
        }
      },
      error: (err) => console.log("carousel test +" + err)
    });
  }

  private initSlider() {
    const imageList = this.safeQuerySelector(".slider-wrapper .image-list");
    const slideButtons = this.safeQuerySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = this.safeQuerySelector(".container .slider-scrollbar");

    if (!imageList || !slideButtons || !sliderScrollbar) {
      console.warn('Carousel elements not found');
      return;
    }

    slideButtons.forEach((button: HTMLElement) => {
      this.renderer.listen(button, 'click', () => {
        const direction = button.id === "prev-slide" ? -1 : 1;
        const scrollAmount = imageList.clientWidth * direction;
        imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });

    this.renderer.listen(window, 'resize', () => {
      this.initSlider();
    });
  }

  RedirectToFacture() {
    this.router.navigateByUrl("/reservationInformation");
  }

  RedirectTOLoginOrfacture() {
    if (this.authService.isAuthService) {
      this.router.navigateByUrl("/reservationInformation");
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  returnUrl(item: any) {
    return item.imagePaths[0];
  }
}
