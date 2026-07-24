import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { EventoService } from '../../evento.service';
import { Evento } from '../../evento.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/eventos.html.twig + eventos_list.html.twig.
@Component({
  selector: 'app-evento-list-public',
  standalone: true,
  imports: [RouterLink, DateToStrPipe, BackButtonComponent],
  templateUrl: './evento-list-public.component.html',
})
export class EventoListPublicComponent implements OnInit {
  private service = inject(EventoService);
  adjuntos = inject(AdjuntoService);
  items: Evento[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
