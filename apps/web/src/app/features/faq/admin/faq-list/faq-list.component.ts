import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FaqService } from '../../faq.service';
import { Faq } from '../../faq.model';

@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Preguntas frecuentes</h2>
      <button pButton label="Nueva pregunta" icon="pi pi-plus" routerLink="/admin/faq/nueva"></button>
    </div>
    <p-table [value]="items" [loading]="loading" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Pregunta</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.pregunta }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/faq', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class FaqListComponent implements OnInit {
  private service = inject(FaqService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  items: Faq[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.findAll().subscribe((data) => {
      this.items = data;
      this.loading = false;
    });
  }

  confirmRemove(item: Faq): void {
    this.confirm.confirm({
      message: `¿Eliminar la pregunta "${item.pregunta}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(item.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminada' });
          this.load();
        });
      },
    });
  }
}
