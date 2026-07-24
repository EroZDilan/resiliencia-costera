import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarcoLegalService } from '../../marco-legal.service';
import { MarcoLegal } from '../../marco-legal.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/marcolegal.html.twig + marcolegal_list.html.twig.
@Component({
  selector: 'app-marco-legal-list-public',
  standalone: true,
  imports: [RouterLink, BackButtonComponent],
  templateUrl: './marco-legal-list-public.component.html',
})
export class MarcoLegalListPublicComponent implements OnInit {
  private service = inject(MarcoLegalService);
  adjuntos = inject(AdjuntoService);
  items: MarcoLegal[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
