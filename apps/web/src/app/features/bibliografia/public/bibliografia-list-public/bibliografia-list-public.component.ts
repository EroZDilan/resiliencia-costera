import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BibliografiaService } from '../../bibliografia.service';
import { Bibliografia } from '../../bibliografia.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/bibliografia.html.twig + bibliografia_list.html.twig.
@Component({
  selector: 'app-bibliografia-list-public',
  standalone: true,
  imports: [RouterLink, BackButtonComponent],
  templateUrl: './bibliografia-list-public.component.html',
})
export class BibliografiaListPublicComponent implements OnInit {
  private service = inject(BibliografiaService);
  adjuntos = inject(AdjuntoService);
  items: Bibliografia[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
