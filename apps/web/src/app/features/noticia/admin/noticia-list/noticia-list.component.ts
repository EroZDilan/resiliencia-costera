import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NoticiaService } from '../../noticia.service';
import { Noticia } from '../../noticia.model';

@Component({
  selector: 'app-noticia-list',
  standalone: true,
  imports: [RouterLink, DatePipe, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Noticias</h2>
      <button pButton label="Nueva" icon="pi pi-plus" routerLink="/admin/noticias/nueva"></button>
    </div>
    <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="20" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Título</th><th>Fecha</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.titulo }}</td>
          <td>{{ item.fecha | date: 'short' }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/noticias', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class NoticiaListComponent implements OnInit {
  private service = inject(NoticiaService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  items: Noticia[] = [];
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

  confirmRemove(item: Noticia): void {
    this.confirm.confirm({
      message: `¿Eliminar "${item.titulo}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(item.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminada', detail: item.titulo });
          this.load();
        });
      },
    });
  }
}
