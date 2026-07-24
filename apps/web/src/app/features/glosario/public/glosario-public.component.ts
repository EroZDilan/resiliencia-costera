import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { GlosarioService } from '../glosario.service';
import { GlosarioGrouped } from '../glosario.model';
import { BackButtonComponent } from '../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/glosario.html.twig, including the scroll
// listener that keeps #letraIndex pinned at its initial viewport position
// once the page scrolls past it (a manual "sticky" done before CSS
// position:sticky was reliable — see the original inline <script>).
@Component({
  selector: 'app-glosario-public',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './glosario-public.component.html',
})
export class GlosarioPublicComponent implements OnInit, AfterViewInit {
  private service = inject(GlosarioService);

  @ViewChild('letraIndex') letraIndexEl?: ElementRef<HTMLDivElement>;
  private initialTop = 0;

  grouped: GlosarioGrouped = {};
  letters: string[] = [];

  ngOnInit(): void {
    this.service.findAllGroupedPublic().subscribe((data) => {
      this.grouped = data;
      this.letters = Object.keys(data).sort();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const el = this.letraIndexEl?.nativeElement;
      if (el) this.initialTop = el.getBoundingClientRect().top + window.scrollY;
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const el = this.letraIndexEl?.nativeElement;
    if (!el) return;
    const offset = window.scrollY - this.initialTop;
    el.style.top = offset > 0 ? `${offset}px` : '0';
  }

  scrollTo(letra: string): void {
    document.getElementById('letra_' + letra)?.scrollIntoView();
  }
}
