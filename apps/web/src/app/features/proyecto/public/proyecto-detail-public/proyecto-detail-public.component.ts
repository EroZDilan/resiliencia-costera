import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProyectoService } from '../../proyecto.service';
import { Proyecto } from '../../proyecto.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { LeafletMapComponent, MapMarker } from '../../../../shared/leaflet-map/leaflet-map.component';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';
import { parseWktPoint } from '../../../../shared/geo/wkt-point';
import { LogoCarouselComponent } from '../../../../shared/logo-carousel/logo-carousel.component';

// Mirrors src/templates/Front/proyecto_show.html.twig.
@Component({
  selector: 'app-proyecto-detail-public',
  standalone: true,
  imports: [RouterLink, LeafletMapComponent, BackButtonComponent, LogoCarouselComponent],
  templateUrl: './proyecto-detail-public.component.html',
})
export class ProyectoDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ProyectoService);
  adjuntos = inject(AdjuntoService);

  proyecto: Proyecto | null = null;
  markers: MapMarker[] = [];

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((proyecto) => {
      this.proyecto = proyecto;
      this.markers = proyecto.lugares
        .map((lugar) => {
          const point = parseWktPoint(lugar.geometria);
          return point ? { nombre: lugar.nombre, ...point } : null;
        })
        .filter((m): m is MapMarker => m !== null);
    });
  }
}
