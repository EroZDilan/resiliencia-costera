import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrganizacionService } from '../../organizacion.service';
import { Organizacion } from '../../organizacion.model';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-organizacion-list',
  standalone: true,
  imports: [RouterLink, TableModule, ButtonModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './organizacion-list.component.html',
  styleUrl: './organizacion-list.component.scss',
})
export class OrganizacionListComponent implements OnInit {
  private service = inject(OrganizacionService);
  private confirm = inject(ConfirmationService);
  private toast = inject(MessageService);
  adjuntos = inject(AdjuntoService);

  organizaciones: Organizacion[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.findAll().subscribe((data) => {
      this.organizaciones = data;
      this.loading = false;
    });
  }

  confirmRemove(org: Organizacion): void {
    this.confirm.confirm({
      message: `¿Eliminar la organización "${org.nombre}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.remove(org.id).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Eliminada', detail: org.nombre });
          this.load();
        });
      },
    });
  }
}
