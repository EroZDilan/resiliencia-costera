import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditorialService } from '../../editorial.service';
import { Editorial } from '../../editorial.model';

@Component({
  selector: 'app-editorial-list',
  standalone: true,
  imports: [RouterLink, DatePipe, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Editoriales</h2>
      <button pButton label="Nueva" icon="pi pi-plus" routerLink="/admin/editoriales/nueva"></button>
    </div>
    <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="20" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Título</th><th>Autores</th><th>Publicación</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.titulo }}</td>
          <td>{{ item.autores }}</td>
          <td>{{ item.fechaInicioPublicacion | date: 'short' }} — {{ item.fechaFinPublicacion | date: 'short' }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/editoriales', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class EditorialListComponent implements OnInit {
  private service = inject(EditorialService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  items: Editorial[] = [];
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

  confirmRemove(item: Editorial): void {
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
