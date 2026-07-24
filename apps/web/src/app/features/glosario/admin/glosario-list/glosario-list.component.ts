import { Component, OnInit, inject } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GlosarioService } from '../../glosario.service';
import { Glosario } from '../../glosario.model';

@Component({
  selector: 'app-glosario-list',
  standalone: true,
  imports: [RouterLink, SlicePipe, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast /><p-confirmDialog />
    <div class="admin-header">
      <h2>Glosario</h2>
      <button pButton label="Nuevo término" icon="pi pi-plus" routerLink="/admin/glosario/nuevo"></button>
    </div>
    <p-table [value]="items" [loading]="loading" [paginator]="true" [rows]="20" dataKey="id">
      <ng-template pTemplate="header">
        <tr><th>Término</th><th>Significado</th><th></th></tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.termino }}</td>
          <td>{{ item.significado | slice: 0 : 100 }}{{ item.significado.length > 100 ? '…' : '' }}</td>
          <td class="admin-actions">
            <button pButton icon="pi pi-pencil" class="p-button-text" [routerLink]="['/admin/glosario', item.id]"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmRemove(item)"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class GlosarioListComponent implements OnInit {
  private service = inject(GlosarioService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);

  items: Glosario[] = [];
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

  confirmRemove(item: Glosario): void {
    this.confirm.confirm({
      message: `¿Eliminar el término "${item.termino}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(item.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminado', detail: item.termino });
          this.load();
        });
      },
    });
  }
}
