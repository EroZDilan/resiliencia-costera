import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateToStrPipe } from '../../../../shared/pipes/date-to-str.pipe';
import { EditorialService } from '../../editorial.service';
import { Editorial } from '../../editorial.model';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/editoriales.html.twig + editoriales_list.html.twig.
@Component({
  selector: 'app-editorial-list-public',
  standalone: true,
  imports: [RouterLink, DateToStrPipe, BackButtonComponent],
  templateUrl: './editorial-list-public.component.html',
})
export class EditorialListPublicComponent implements OnInit {
  private service = inject(EditorialService);
  items: Editorial[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
