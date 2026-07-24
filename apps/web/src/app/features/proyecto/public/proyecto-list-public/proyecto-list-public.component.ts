import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';
import { ProyectoService } from '../../proyecto.service';
import { EstadoProyecto, Proyecto } from '../../proyecto.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';

// Mirrors src/templates/Front/proyectos.html.twig + proyectos_list.html.twig.
@Component({
  selector: 'app-proyecto-list-public',
  standalone: true,
  imports: [RouterLink, BackButtonComponent],
  templateUrl: './proyecto-list-public.component.html',
})
export class ProyectoListPublicComponent implements OnInit {
  private service = inject(ProyectoService);
  private route = inject(ActivatedRoute);
  adjuntos = inject(AdjuntoService);

  proyectos: Proyecto[] = [];
  estado: EstadoProyecto = 'EN_CURSO';

  ngOnInit(): void {
    const queryEstado = this.route.snapshot.queryParamMap.get('estado');
    if (queryEstado === 'EN_CURSO' || queryEstado === 'TERMINADO') {
      this.estado = queryEstado;
    }
    this.load();
  }

  setEstado(estado: EstadoProyecto): void {
    if (estado === this.estado) return;
    this.estado = estado;
    this.load();
  }

  private load(): void {
    this.service.findAllPublic(this.estado).subscribe((data) => (this.proyectos = data));
  }
}
