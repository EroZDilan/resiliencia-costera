import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { IncidenciaService } from '../../incidencia.service';
import { Incidencia, IncidenciaGrouped } from '../../incidencia.model';

@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [RouterLink, DatePipe, NgTemplateOutlet, TableModule, TabViewModule, TagModule, ButtonModule],
  template: `
    <h2>Incidencias</h2>
    <p-tabView>
      <p-tabPanel [header]="'Pendientes (' + grouped.pendientes.length + ')'">
        <ng-container *ngTemplateOutlet="table; context: { $implicit: grouped.pendientes }" />
      </p-tabPanel>
      <p-tabPanel [header]="'Mías (' + grouped.propias.length + ')'">
        <ng-container *ngTemplateOutlet="table; context: { $implicit: grouped.propias }" />
      </p-tabPanel>
      <p-tabPanel [header]="'De otros (' + grouped.otras.length + ')'">
        <ng-container *ngTemplateOutlet="table; context: { $implicit: grouped.otras }" />
      </p-tabPanel>
    </p-tabView>

    <ng-template #table let-items>
      <p-table [value]="items" dataKey="id">
        <ng-template pTemplate="header">
          <tr><th>Código</th><th>Tipo</th><th>Reportado por</th><th>Estado</th><th>Fecha</th><th></th></tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.codigo }}</td>
            <td>{{ item.tipo }}</td>
            <td>{{ item.nombre }}</td>
            <td><p-tag [value]="estadoLabel(item)" [severity]="estadoSeverity(item)" /></td>
            <td>{{ item.fechaEstado | date: 'short' }}</td>
            <td>
              <button pButton icon="pi pi-eye" class="p-button-text" [routerLink]="['/admin/incidencias', item.id]"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </ng-template>
  `,
})
export class IncidenciaListComponent implements OnInit {
  private service = inject(IncidenciaService);

  grouped: IncidenciaGrouped = { pendientes: [], propias: [], otras: [] };

  ngOnInit(): void {
    this.service.findAllGrouped().subscribe((data) => (this.grouped = data));
  }

  estadoLabel(item: Incidencia): string {
    return { PENDIENTE: 'Pendiente', EN_PROCESO: 'En proceso', CERRADO: 'Cerrado' }[item.estado];
  }

  estadoSeverity(item: Incidencia): 'warn' | 'info' | 'success' {
    return item.estado === 'PENDIENTE' ? 'warn' : item.estado === 'EN_PROCESO' ? 'info' : 'success';
  }
}
