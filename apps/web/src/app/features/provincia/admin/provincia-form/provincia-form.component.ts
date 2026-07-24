import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProvinciaService } from '../../provincia.service';

@Component({
  selector: 'app-provincia-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, InputNumberModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar provincia' : 'Nueva provincia' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="nombre">Nombre *</label>
        <input pInputText id="nombre" formControlName="nombre" />
      </div>
      <div class="admin-field">
        <label for="dpa">DPA *</label>
        <p-inputNumber inputId="dpa" formControlName="dpa" [useGrouping]="false" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/provincias"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class ProvinciaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ProvinciaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    dpa: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => this.form.patchValue(item));
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const payload = this.form.getRawValue() as { nombre: string; dpa: number };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/provincias']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
