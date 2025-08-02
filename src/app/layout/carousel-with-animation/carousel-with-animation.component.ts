import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Voiture } from "../../sahred/model/voitureModel/voiture.model";
import { Appartement } from "../../sahred/model/appartemetModel/appartement.model";
import { VoitureService } from "../../sahred/service/voitureService/voiture.service";
import { AppartemetService } from "../../sahred/service/appartemetService/appartemet.service";
import { Router } from "@angular/router";
import { BaseCarouselComponent } from '../../shared/components/base-carousel.component';

@Component({
  selector: 'app-carousel-with-animation',
  templateUrl: './carousel-with-animation.component.html',
  styleUrls: ['./carousel-with-animation.component.css']
})
export class CarouselWithAnimationComponent extends BaseCarouselComponent {
  // Carousel properties
  private nextDom!: HTMLElement | null;
  private prevDom!: HTMLElement | null;
  private carouselDom!: HTMLElement | null;
  private sliderDom!: HTMLElement | null;
  private thumbnailBorderDom!: HTMLElement | null;
  private thumbnailItemsDom!: NodeListOf<HTMLElement>;
  private timeDom!: HTMLElement | null;

  timeRunning: number = 3000;
  timeAutoNext: number = 7000;

  datVoiture: Array<Voiture> = [];
  public allAppartement: any[] = [];

  constructor(
    private voitureService: VoitureService,
    private apartement: AppartemetService,
    private router: Router,
    @Inject(PLATFORM_ID) protected override platformId: Object,
    protected override renderer: Renderer2,
    protected override el: ElementRef
  ) {
    super(renderer, el, platformId);
  }

  ngOnInit(): void {
    this.getAllVoiture();
    this.getAllAppartement();
  }

  protected override initializeCarousel(): void {
    this.nextDom = this.safeQuerySelector('#next');
    this.prevDom = this.safeQuerySelector('#prev');
    this.carouselDom = this.safeQuerySelector('.carousel');

    if (this.carouselDom) {
      this.sliderDom = this.safeQuerySelector('.carousel .list');
    }

    this.thumbnailBorderDom = this.safeQuerySelector('.carousel .thumbnail');
    this.timeDom = this.safeQuerySelector('.carousel .time');

    if (this.thumbnailBorderDom) {
      this.thumbnailItemsDom = this.safeQuerySelectorAll('.carousel .thumbnail .item');
      if (this.thumbnailItemsDom.length > 0) {
        this.renderer.appendChild(this.thumbnailBorderDom, this.thumbnailItemsDom[0]);
      }
    }

    if (this.nextDom) {
      this.renderer.listen(this.nextDom, 'click', () => this.showSlider('next'));
    }

    if (this.prevDom) {
      this.renderer.listen(this.prevDom, 'click', () => this.showSlider('prev'));
    }

    this.runNextAuto = setTimeout(() => {
      if (this.nextDom) {
        const event = new MouseEvent('click');
        this.nextDom.dispatchEvent(event);
      }
    }, this.timeAutoNext);

    this.initSlider();
  }

  private showSlider(type: string): void {
    if (!this.sliderDom || !this.thumbnailBorderDom || !this.carouselDom) return;

    const sliderItemsDom = this.safeQuerySelectorAll('.carousel .list .item');
    const thumbnailItemsDom = this.safeQuerySelectorAll('.carousel .thumbnail .item');

    if (type === 'next') {
      this.renderer.appendChild(this.sliderDom, sliderItemsDom[0]);
      this.renderer.appendChild(this.thumbnailBorderDom, thumbnailItemsDom[0]);
      this.renderer.addClass(this.carouselDom, 'next');
    } else {
      this.renderer.insertBefore(
        this.sliderDom,
        sliderItemsDom[sliderItemsDom.length - 1],
        this.sliderDom.firstChild
      );
      this.renderer.insertBefore(
        this.thumbnailBorderDom,
        thumbnailItemsDom[thumbnailItemsDom.length - 1],
        this.thumbnailBorderDom.firstChild
      );
      this.renderer.addClass(this.carouselDom, 'prev');
    }

    clearTimeout(this.runTimeOut);
    this.runTimeOut = setTimeout(() => {
      if (this.carouselDom) {
        this.renderer.removeClass(this.carouselDom, 'next');
        this.renderer.removeClass(this.carouselDom, 'prev');
      }
    }, this.timeRunning);

    clearTimeout(this.runNextAuto);
    this.runNextAuto = setTimeout(() => {
      if (this.nextDom) {
        const event = new MouseEvent('click');
        this.nextDom.dispatchEvent(event);
      }
    }, this.timeAutoNext);
  }

  private initSlider(): void {
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
      this.initSlider();
    });
  }



  redirectVersLogin() {
    this.router.navigateByUrl("/login");
  }

  RedirectToFacture() {
    this.router.navigateByUrl("/reservationInformation");
  }

  getAllVoiture() {
    this.voitureService.getAll().subscribe({
      next: (data) => {
        this.datVoiture = data;
      }
    });
  }

  getAllAppartement() {
    this.apartement.getAll().subscribe({
      next: data => {
        this.allAppartement = data;
      },
      error: err => {
        console.log("error", err);
      }
    });
  }

  returnUrl(item: any) {
    return item.imagePaths?.[0] || '';
  }
}
