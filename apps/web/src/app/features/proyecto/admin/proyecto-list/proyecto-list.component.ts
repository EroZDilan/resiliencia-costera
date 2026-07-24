import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProyectoService } from '../../proyecto.service';
import { Proyecto } from '../../proyecto.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-proyecto-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, TagModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './proyecto-list.component.html',
  styleUrl: './proyecto-list.component.scss',
})
export class ProyectoListComponent implements OnInit {
  private service = inject(ProyectoService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);
  adjuntos = inject(AdjuntoService);

  proyectos: Proyecto[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.findAll().subscribe((data) => {
      this.proyectos = data;
      this.loading = false;
    });
  }

  exportExcel(): void {
    window.open(this.service.exportExcelUrl(), '_blank');
  }

  confirmRemove(proyecto: Proyecto): void {
    this.confirm.confirm({
      message: `¿Eliminar el proyecto "${proyecto.nombreCorto}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(proyecto.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminado', detail: proyecto.nombreCorto });
          this.load();
        });
      },
    });
  }
}
