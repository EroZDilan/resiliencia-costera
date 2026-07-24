import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { EditorialService } from '../../editorial.service';
import { Editorial } from '../../editorial.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/editorial_show.html.twig.
@Component({
  selector: 'app-editorial-detail-public',
  standalone: true,
  imports: [DateToStrPipe, BackButtonComponent],
  templateUrl: './editorial-detail-public.component.html',
})
export class EditorialDetailPublicComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(EditorialService);
  adjuntos = inject(AdjuntoService);

  item: Editorial | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.service.findBySlug(slug).subscribe((item) => (this.item = item));
  }
}
