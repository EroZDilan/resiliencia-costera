import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrganizacionService } from '../../organizacion.service';
import { Organizacion } from '../../organizacion.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/organizaciones.html.twig + organizaciones_list.html.twig.
@Component({
  selector: 'app-organizacion-list-public',
  standalone: true,
  imports: [RouterLink, BackButtonComponent],
  templateUrl: './organizacion-list-public.component.html',
})
export class OrganizacionListPublicComponent implements OnInit {
  private service = inject(OrganizacionService);
  adjuntos = inject(AdjuntoService);
  items: Organizacion[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
