import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IniciativaService } from '../../iniciativa.service';
import { Iniciativa } from '../../iniciativa.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-iniciativa-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Iniciativas</h2>
      <div class="admin-header-actions">
        <button pButton label="Exportar a Excel" icon="pi pi-file-excel" class="p-button-outlined" (click)="exportExcel()"></button>
        <button pButton label="Nueva iniciativa" icon="pi pi-plus" routerLink="/admin/iniciativas/nueva"></button>
      </div>
    </div>
    <p-table [value]="items" [loading]="loading" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Logo</th><th>Nombre</th><th>Contacto</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>@if (adjuntos.url(item.logo); as url) { <img [src]="url" width="48" alt="" /> }</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.email || item.telefono || '' }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/iniciativas', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class IniciativaListComponent implements OnInit {
  private service = inject(IniciativaService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);
  adjuntos = inject(AdjuntoService);

  items: Iniciativa[] = [];
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

  exportExcel(): void {
    window.open(this.service.exportExcelUrl(), '_blank');
  }

  confirmRemove(item: Iniciativa): void {
    this.confirm.confirm({
      message: `¿Eliminar la iniciativa "${item.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(item.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminada', detail: item.nombre });
          this.load();
        });
      },
    });
  }
}
