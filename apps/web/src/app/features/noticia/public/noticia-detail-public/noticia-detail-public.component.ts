import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { NoticiaService } from '../../noticia.service';
import { Noticia } from '../../noticia.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/noticia_show.html.twig.
@Component({
  selector: 'app-noticia-detail-public',
  standalone: true,
  imports: [DateToStrPipe, BackButtonComponent],
  templateUrl: './noticia-detail-public.component.html',
})
export class NoticiaDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(NoticiaService);
  adjuntos = inject(AdjuntoService);

  item: Noticia | null = null;

  imageUrl(item: Noticia): string | null {
    return this.adjuntos.url(item.imagen) ?? item.imagenUrl;
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
