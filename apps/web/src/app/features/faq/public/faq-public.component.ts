import { Component, OnInit, inject } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FaqService } from '../faq.service';
import { Faq } from '../faq.model';

@Component({
  selector: 'app-faq-public',
  standalone: true,
  imports: [AccordionModule],
  template: `
    <h1>Preguntas frecuentes</h1>
    <p-accordion>
      @for (item of items; track item.id) {
        <p-accordion-panel [value]="item.id">
          <p-accordion-header>{{ item.pregunta }}</p-accordion-header>
          <p-accordion-content>{{ item.respuesta }}</p-accordion-content>
        </p-accordion-panel>
      }
    </p-accordion>
  `,
})
export class FaqPublicComponent implements OnInit {
  private service = inject(FaqService);
  items: Faq[] = [];

  ngOnInit(): void {
    this.service.findAllPublic().subscribe((data) => (this.items = data));
  }
}
