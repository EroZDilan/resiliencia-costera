import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IniciativaService } from '../../iniciativa.service';
import { Iniciativa } from '../../iniciativa.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/iniciativas.html.twig + iniciativas_list.html.twig.
@Component({
  selector: 'app-iniciativa-list-public',
  standalone: true,
  imports: [RouterLink, BackButtonComponent],
  templateUrl: './iniciativa-list-public.component.html',
})
export class IniciativaListPublicComponent implements OnInit {
  private service = inject(IniciativaService);
  adjuntos = inject(AdjuntoService);
  items: Iniciativa[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
