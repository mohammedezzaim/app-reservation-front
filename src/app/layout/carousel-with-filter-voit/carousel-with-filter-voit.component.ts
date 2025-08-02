import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { VoitureService } from "../../sahred/service/voitureService/voiture.service";
import { Voiture } from "../../sahred/model/voitureModel/voiture.model";
import { CategorieVoitureService } from "../../sahred/service/voitureService/categorie-voiture.service";
import { BaseCarouselComponent } from '../../shared/components/base-carousel.component';

@Component({
  selector: 'app-carousel-with-filter-voit',
  templateUrl: './carousel-with-filter-voit.component.html',
  styleUrls: ['./carousel-with-filter-voit.component.css']
})
export class CarouselWithFilterVOITComponent extends BaseCarouselComponent {
  public display: boolean = false;
  public formatcard: boolean = false;
  public selected: boolean = true;
  public h1Content!: string;
  public dataVoiture: Array<Voiture> = [];
  public categories: any[] = [];

  @ViewChild('infoDiv', { static: false }) infoDiv!: ElementRef;

  constructor(
    protected override renderer: Renderer2,
    protected override el: ElementRef,
    @Inject(PLATFORM_ID) protected override platformId: Object,
    private router: Router,
    private voitureservice: VoitureService,
    private categoriesService: CategorieVoitureService
  ) {
    super(renderer, el, platformId);
  }

  ngOnInit() {
    this.loadCategories();
  }

  protected override initializeCarousel(): void {
    this.initSlider();
  }

  private loadCategories() {
    this.categoriesService.getAll().subscribe({
      next: data => this.categories = data,
      error: err => console.log(err)
    });
  }

  private initSlider() {
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
    this.voitureservice.findVoitureByCategoriLibelle(h1Element).subscribe({
      next: (data) => this.dataVoiture = data
    });
    this.h1Content = h1Element;
  }

  returnUrl(voiture: any): string {
    return voiture.imagePaths[0];
  }
}
