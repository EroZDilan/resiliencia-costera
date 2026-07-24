import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IniciativaService } from '../../iniciativa.service';
import { Iniciativa } from '../../iniciativa.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';
import { LogoCarouselComponent } from '../../../../shared/logo-carousel/logo-carousel.component';

// Mirrors src/templates/Front/iniciativa_show.html.twig.
@Component({
  selector: 'app-iniciativa-detail-public',
  standalone: true,
  imports: [RouterLink, BackButtonComponent, LogoCarouselComponent],
  templateUrl: './iniciativa-detail-public.component.html',
})
export class IniciativaDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(IniciativaService);
  adjuntos = inject(AdjuntoService);

  item: Iniciativa | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
