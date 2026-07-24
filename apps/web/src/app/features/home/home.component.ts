import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DateToStrPipe } from '../../shared/pipes/date-to-str.pipe';
import { ConfiguracionService } from '../configuracion/configuracion.service';
import { Configuracion } from '../configuracion/configuracion.model';
import { OrganizacionService } from '../organizacion/organizacion.service';
import { Organizacion } from '../organizacion/organizacion.model';
import { EditorialService } from '../editorial/editorial.service';
import { Editorial } from '../editorial/editorial.model';
import { ColaboracionService } from '../colaboracion/colaboracion.service';
import { Colaboracion } from '../colaboracion/colaboracion.model';
import { NoticiaService } from '../noticia/noticia.service';
import { Noticia } from '../noticia/noticia.model';
import { EventoService } from '../evento/evento.service';
import { Evento } from '../evento/evento.model';
import { AdjuntoService } from '../../core/adjunto/adjunto.service';
import { LogoCarouselComponent } from '../../shared/logo-carousel/logo-carousel.component';

// Mirrors src/templates/Front/home.html.twig exactly (same classes/structure)
// so the copied front.css applies unchanged.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DateToStrPipe, LogoCarouselComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private configuracionService = inject(ConfiguracionService);
  private organizacionService = inject(OrganizacionService);
  private editorialService = inject(EditorialService);
  private colaboracionService = inject(ColaboracionService);
  private noticiaService = inject(NoticiaService);
  private eventoService = inject(EventoService);
  adjuntos = inject(AdjuntoService);

  configuracion: Configuracion | null = null;
  organizaciones: Organizacion[] = [];
  editorialReciente: Editorial | null = null;
  colaboracionReciente: Colaboracion | null = null;
  noticias: Noticia[] = [];
  eventos: Evento[] = [];

  ngOnInit(): void {
    forkJoin({
      configuracion: this.configuracionService.getPublic(),
      organizaciones: this.organizacionService.findAllPublic(),
      editoriales: this.editorialService.findAllPublic(),
      colaboraciones: this.colaboracionService.findAllPublic(),
      noticias: this.noticiaService.findAllPublic(),
      eventos: this.eventoService.findAllPublic(),
    }).subscribe(({ configuracion, organizaciones, editoriales, colaboraciones, noticias, eventos }) => {
      this.configuracion = configuracion;
      this.organizaciones = organizaciones;
      // Backend already orders these DESC by publication/date; mirrors the
      // legacy queries' setMaxResults(1)/(4).
      this.editorialReciente = editoriales[0] ?? null;
      this.colaboracionReciente = colaboraciones[0] ?? null;
      this.noticias = noticias.slice(0, 4);
      const now = new Date();
      this.eventos = eventos.filter(
        (e) => new Date(e.fechaInicioPublicacion) <= now && new Date(e.fechaFinPublicacion) >= now,
      );
    });
  }
}
