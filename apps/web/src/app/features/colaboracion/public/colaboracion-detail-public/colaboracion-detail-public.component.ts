import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { ColaboracionService } from '../../colaboracion.service';
import { Colaboracion } from '../../colaboracion.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/colaboracion_show.html.twig.
@Component({
  selector: 'app-colaboracion-detail-public',
  standalone: true,
  imports: [DateToStrPipe, BackButtonComponent],
  templateUrl: './colaboracion-detail-public.component.html',
})
export class ColaboracionDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ColaboracionService);
  adjuntos = inject(AdjuntoService);

  item: Colaboracion | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
