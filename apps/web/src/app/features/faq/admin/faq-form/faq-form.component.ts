import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FaqService } from '../../faq.service';

@Component({
  selector: 'app-faq-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, TextareaModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar pregunta' : 'Nueva pregunta' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="pregunta">Pregunta *</label>
        <input pInputText id="pregunta" formControlName="pregunta" />
      </div>
      <div class="admin-field">
        <label for="respuesta">Respuesta *</label>
        <textarea pTextarea id="respuesta" formControlName="respuesta" rows="5"></textarea>
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/faq"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class FaqFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(FaqService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    pregunta: ['', Validators.required],
    respuesta: ['', Validators.required],
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
    const payload = this.form.getRawValue();
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/faq']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
