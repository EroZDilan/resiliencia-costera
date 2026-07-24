import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Organizacion } from '../../features/organizacion/organizacion.model';
import { AdjuntoService } from '../../core/adjunto/adjunto.service';

// Replaces owl-carousel (items: entities.length, loop: true, autoplay: true,
// autoplayTimeout: 5000): a real auto-advancing, infinitely-looping single
// row of logos — not a static grid. Owl with items===count sizes each item
// to exactly containerWidth/count so the row fills edge-to-edge with no
// partial item peeking in; we measure the container the same way instead of
// hardcoding a pixel width. Used on the home page and on the Proyecto/
// Iniciativa detail pages for organizacionesLideres/Participantes.
@Component({
  selector: 'app-logo-carousel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div #container class="owl-carousel owl-theme" style="overflow: hidden; display: block">
      <div #track style="display: flex; transition: transform 0.6s ease">
        @for (organizacion of displayItems; track $index) {
          <div class="item" [style.flex]="'0 0 ' + itemWidth + 'px'">
            <a [routerLink]="['/organizaciones', organizacion.slug]">
              <div
                [style.background-image]="'url(' + adjuntos.url(organizacion.logo) + ')'"
                style="background-repeat: no-repeat; background-position: center; height: 200px; cursor: pointer"
              ></div>
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class LogoCarouselComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() organizaciones: Organizacion[] = [];
  @ViewChild('track') track?: ElementRef<HTMLDivElement>;
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;
  adjuntos = inject(AdjuntoService);

  displayItems: Organizacion[] = [];
  itemWidth = 236;
  private index = 0;
  private timer?: ReturnType<typeof setInterval>;
  private viewReady = false;

  ngOnChanges(): void {
    this.displayItems = [...this.organizaciones, ...this.organizaciones];
    this.index = 0;
    clearInterval(this.timer);
    if (this.viewReady) this.measure();
    if (this.organizaciones.length > 1) {
      this.timer = setInterval(() => this.advance(), 5000);
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.measure();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private measure(): void {
    const width = this.container?.nativeElement.clientWidth;
    if (width && this.organizaciones.length > 0) {
      this.itemWidth = width / this.organizaciones.length;
    }
  }

  private advance(): void {
    this.index++;
    const el = this.track?.nativeElement;
    if (!el) return;
    el.style.transition = 'transform 0.6s ease';
    el.style.transform = `translateX(-${this.index * this.itemWidth}px)`;
    if (this.index >= this.organizaciones.length) {
      setTimeout(() => {
        el.style.transition = 'none';
        this.index = 0;
        el.style.transform = 'translateX(0)';
      }, 600);
    }
  }
}
