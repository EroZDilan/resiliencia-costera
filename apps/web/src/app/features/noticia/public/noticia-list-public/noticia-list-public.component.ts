import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { NoticiaService } from '../../noticia.service';
import { Noticia } from '../../noticia.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/noticias.html.twig + noticias_list.html.twig.
@Component({
  selector: 'app-noticia-list-public',
  standalone: true,
  imports: [RouterLink, DateToStrPipe, BackButtonComponent],
  templateUrl: './noticia-list-public.component.html',
})
export class NoticiaListPublicComponent implements OnInit {
  private service = inject(NoticiaService);
  adjuntos = inject(AdjuntoService);
  items: Noticia[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
