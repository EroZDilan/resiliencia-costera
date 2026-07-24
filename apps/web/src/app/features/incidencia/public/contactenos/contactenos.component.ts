import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IncidenciaService } from '../../incidencia.service';
import { TIPO_INCIDENCIA_OPTIONS } from '../../incidencia.model';
import { BackButtonComponent } from '../../../../shared/back-button/back-button.component';

// Mirrors src/templates/Front/contactenos.html.twig (title) + the generic
// crud "new" form (bg-light-grey box, label/input rows, btn btn-primary).
@Component({
  selector: 'app-contactenos',
  standalone: true,
  imports: [ReactiveFormsModule, BackButtonComponent],
  templateUrl: './contactenos.component.html',
})
export class ContactenosComponent {
  private fb = inject(FormBuilder);
  private service = inject(IncidenciaService);

  tipos = TIPO_INCIDENCIA_OPTIONS;
  sending = false;
  codigoGenerado: string | null = null;

  form = this.fb.nonNullable.group({
    tipo: ['', Validators.required],
    descripcion: ['', Validators.required],
    nombre: ['', Validators.required],
    email: [''],
    telefono: [''],
    ocupacion: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.sending = true;
    this.service.create(this.form.getRawValue()).subscribe({
      next: (incidencia) => {
        this.sending = false;
        this.codigoGenerado = incidencia.codigo;
      },
      error: () => {
        this.sending = false;
      },
    });
  }
}
