import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarcoLegalService } from '../../marco-legal.service';
import { MarcoLegal } from '../../marco-legal.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/marcolegal_show.html.twig.
@Component({
  selector: 'app-marco-legal-detail-public',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './marco-legal-detail-public.component.html',
})
export class MarcoLegalDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(MarcoLegalService);
  adjuntos = inject(AdjuntoService);

  item: MarcoLegal | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
