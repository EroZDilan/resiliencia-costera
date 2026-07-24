import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { EventoService } from '../../evento.service';
import { Evento } from '../../evento.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/evento_show.html.twig.
@Component({
  selector: 'app-evento-detail-public',
  standalone: true,
  imports: [DateToStrPipe, BackButtonComponent],
  templateUrl: './evento-detail-public.component.html',
})
export class EventoDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(EventoService);
  adjuntos = inject(AdjuntoService);

  item: Evento | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
