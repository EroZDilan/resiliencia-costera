import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BibliografiaService } from '../../bibliografia.service';
import { Bibliografia } from '../../bibliografia.model';

@Component({
  selector: 'app-bibliografia-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Bibliografía</h2>
      <button pButton label="Nueva" icon="pi pi-plus" routerLink="/admin/bibliografia/nueva"></button>
    </div>
    <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="20" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Título</th><th>Autores</th><th>ISBN</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.titulo }}</td>
          <td>{{ item.autores }}</td>
          <td>{{ item.isbn }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/bibliografia', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class BibliografiaListComponent implements OnInit {
  private service = inject(BibliografiaService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  items: Bibliografia[] = [];
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

  confirmRemove(item: Bibliografia): void {
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
