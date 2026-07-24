import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { ColaboracionService } from '../../colaboracion.service';
import { Colaboracion } from '../../colaboracion.model';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/colaboraciones.html.twig + colaboraciones_list.html.twig.
@Component({
  selector: 'app-colaboracion-list-public',
  standalone: true,
  imports: [RouterLink, DateToStrPipe, BackButtonComponent],
  templateUrl: './colaboracion-list-public.component.html',
})
export class ColaboracionListPublicComponent implements OnInit {
  private service = inject(ColaboracionService);
  items: Colaboracion[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
