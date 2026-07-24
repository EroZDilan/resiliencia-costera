import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MunicipioService } from '../../municipio.service';
import { Municipio } from '../../municipio.model';

@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Municipios</h2>
      <button pButton label="Nuevo municipio" icon="pi pi-plus" routerLink="/admin/municipios/nuevo"></button>
    </div>
    <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="20" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Nombre</th><th>Provincia</th><th>DPA</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.nombre }}</td>
          <td>{{ item.provincia?.nombre }}</td>
          <td>{{ item.dpa }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/municipios', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class MunicipioListComponent implements OnInit {
  private service = inject(MunicipioService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  items: Municipio[] = [];
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

  confirmRemove(item: Municipio): void {
    this.confirm.confirm({
      message: `¿Eliminar el municipio "${item.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(item.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminado', detail: item.nombre });
          this.load();
        });
      },
    });
  }
}
