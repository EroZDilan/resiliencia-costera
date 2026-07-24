import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BibliografiaService } from '../../bibliografia.service';
import { Bibliografia } from '../../bibliografia.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/bibliografia_show.html.twig.
@Component({
  selector: 'app-bibliografia-detail-public',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './bibliografia-detail-public.component.html',
})
export class BibliografiaDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(BibliografiaService);
  adjuntos = inject(AdjuntoService);

  item: Bibliografia | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
