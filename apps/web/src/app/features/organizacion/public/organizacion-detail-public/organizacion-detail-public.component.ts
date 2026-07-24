import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizacionService } from '../../organizacion.service';
import { Organizacion } from '../../organizacion.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/organizacion_show.html.twig.
@Component({
  selector: 'app-organizacion-detail-public',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './organizacion-detail-public.component.html',
})
export class OrganizacionDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(OrganizacionService);
  adjuntos = inject(AdjuntoService);

  item: Organizacion | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
