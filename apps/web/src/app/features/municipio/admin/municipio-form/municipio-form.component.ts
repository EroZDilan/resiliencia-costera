import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MunicipioService } from '../../municipio.service';
import { ProvinciaService } from '../../../provincia/provincia.service';
import { Provincia } from '../../../provincia/provincia.model';

@Component({
  selector: 'app-municipio-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar municipio' : 'Nuevo municipio' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="nombre">Nombre *</label>
        <input pInputText id="nombre" formControlName="nombre" />
      </div>
      <div class="admin-field">
        <label for="provinciaId">Provincia</label>
        <p-select id="provinciaId" formControlName="provinciaId" [options]="provincias" optionLabel="nombre" optionValue="id" [showClear]="true" />
      </div>
      <div class="admin-field">
        <label for="dpa">DPA *</label>
        <p-inputNumber inputId="dpa" formControlName="dpa" [useGrouping]="false" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/municipios"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class MunicipioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(MunicipioService);
  private provinciaService = inject(ProvinciaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;
  provincias: Provincia[] = [];

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    dpa: this.fb.control<number | null>(null, Validators.required),
    provinciaId: this.fb.control<number | null>(null),
  });

  ngOnInit(): void {
    this.provinciaService.findAll().subscribe((data) => (this.provincias = data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => {
        this.form.patchValue({ nombre: item.nombre, dpa: item.dpa, provinciaId: item.provincia?.id ?? null });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const raw = this.form.getRawValue();
    const payload = { nombre: raw.nombre, dpa: raw.dpa!, provinciaId: raw.provinciaId ?? undefined };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/municipios']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
