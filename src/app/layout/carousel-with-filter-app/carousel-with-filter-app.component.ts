import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { AppartemetService } from "../../sahred/service/appartemetService/appartemet.service";
import { Appartement } from "../../sahred/model/appartemetModel/appartement.model";
import { CategoriesAppartementService } from "../../sahred/service/appartemetService/categories-appartement.service";
import { BaseCarouselComponent } from '../../shared/components/base-carousel.component';

@Component({
  selector: 'app-carousel-with-filter-app',
  templateUrl: './carousel-with-filter-app.component.html',
  styleUrls: ['./carousel-with-filter-app.component.css']
})
export class CarouselWithFilterAPPComponent extends BaseCarouselComponent {
  public listCategories: any[] = [];
  public display: boolean = false;
  public formatcard: boolean = false;
  public selected: boolean = true;
  h1Content: string = '';
  public dataApp: Array<Appartement> = [];

  @ViewChild('infoDiv', { static: false }) infoDiv!: ElementRef;

  constructor(
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    @Inject(PLATFORM_ID) protected override platformId: Object,
    private router: Router,
    private appService: AppartemetService,
    private categoriesService: CategoriesAppartementService
  ) {
    super(renderer, el, platformId);
  }

   ngOnInit() {
    this.getAllaCategoriesApparatemet();
  }

  protected override initializeCarousel(): void {
    this.initSlider();
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

  getAllaCategoriesApparatemet() {
    this.categoriesService.getAll().subscribe({
      next: data => {
        this.listCategories = data;
      },
      error: err => {}
    });
  }

  RedirectToFacture() {
    this.display = true;
  }

  handelVertical() {
    this.formatcard = false;
  }

  handelHorizental() {
    this.formatcard = true;
  }

  getH1Content(h1Element: string) {
    this.appService.getAppartemetsbyLibelle(h1Element).subscribe({
      next: (data) => {
        this.dataApp = data;
      }
    });
  }

  returnUrl(appartemet: any): string {
    return appartemet.imagePaths[0];
  }

  returnUrlOne(categories: any): string {
    return categories.imagePaths;
  }
}
