import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IniciativaService } from '../../iniciativa.service';
import { OrganizacionService } from '../../../organizacion/organizacion.service';
import { Organizacion } from '../../../organizacion/organizacion.model';
import { AdjuntoService, Adjunto } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-iniciativa-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MultiSelectModule,
    FileUploadModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <h2>{{ id ? 'Editar iniciativa' : 'Nueva iniciativa' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="admin-form">
      <div class="admin-field">
        <label for="nombre">Nombre *</label>
        <input pInputText id="nombre" formControlName="nombre" />
      </div>
      <div class="admin-field">
        <label for="descripcion">Descripción *</label>
        <textarea pTextarea id="descripcion" formControlName="descripcion" rows="4"></textarea>
      </div>
      <div class="admin-field">
        <label for="areaIntervencion">Área de intervención</label>
        <input pInputText id="areaIntervencion" formControlName="areaIntervencion" />
      </div>
      <div class="admin-field">
        <label>Logo *</label>
        @if (adjuntos.url(logo); as url) { <img [src]="url" width="80" alt="" /> }
        <p-fileUpload mode="basic" chooseLabel="Subir logo" accept="image/*"
                      [customUpload]="true" (uploadHandler)="uploadLogo($event)" [auto]="true" />
      </div>
      <div class="admin-field">
        <label for="email">Email (email o teléfono es obligatorio)</label>
        <input pInputText id="email" formControlName="email" />
      </div>
      <div class="admin-field">
        <label for="telefono">Teléfono</label>
        <input pInputText id="telefono" formControlName="telefono" />
      </div>
      <div class="admin-field">
        <label for="facebook">Facebook</label>
        <input pInputText id="facebook" formControlName="facebook" />
      </div>
      <div class="admin-field">
        <label for="instagram">Instagram</label>
        <input pInputText id="instagram" formControlName="instagram" />
      </div>
      <div class="admin-field">
        <label for="twitter">Twitter</label>
        <input pInputText id="twitter" formControlName="twitter" />
      </div>
      <div class="admin-field">
        <label for="organizacionesLideresIds">Organizaciones líderes (al menos un líder es obligatorio)</label>
        <p-multiSelect id="organizacionesLideresIds" formControlName="organizacionesLideresIds"
                       [options]="organizaciones" optionLabel="nombre" optionValue="id" display="chip" />
      </div>
      <div class="admin-field">
        <label for="otrosLideres">Otros líderes (texto libre)</label>
        <input pInputText id="otrosLideres" formControlName="otrosLideres" />
      </div>
      <div class="admin-field">
        <label for="organizacionesParticipantesIds">Organizaciones participantes</label>
        <p-multiSelect id="organizacionesParticipantesIds" formControlName="organizacionesParticipantesIds"
                       [options]="organizaciones" optionLabel="nombre" optionValue="id" display="chip" />
      </div>
      <div class="admin-field">
        <label for="otrosParticipantes">Otros participantes (texto libre)</label>
        <input pInputText id="otrosParticipantes" formControlName="otrosParticipantes" />
      </div>
      <div class="admin-form-actions">
        <button pButton type="button" label="Cancelar" class="p-button-text" routerLink="/admin/iniciativas"></button>
        <button pButton type="submit" label="Guardar" [loading]="saving"></button>
      </div>
    </form>
  `,
})
export class IniciativaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(IniciativaService);
  private organizacionService = inject(OrganizacionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);
  adjuntos = inject(AdjuntoService);

  id: number | null = null;
  saving = false;
  logo: Adjunto | null = null;
  organizaciones: Organizacion[] = [];

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    areaIntervencion: [''],
    email: [''],
    telefono: [''],
    facebook: [''],
    instagram: [''],
    twitter: [''],
    otrosLideres: [''],
    otrosParticipantes: [''],
    organizacionesLideresIds: this.fb.nonNullable.control<number[]>([]),
    organizacionesParticipantesIds: this.fb.nonNullable.control<number[]>([]),
  });

  ngOnInit(): void {
    this.organizacionService.findAll().subscribe((data) => (this.organizaciones = data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((item) => {
        this.form.patchValue({
          nombre: item.nombre,
          descripcion: item.descripcion,
          areaIntervencion: item.areaIntervencion ?? '',
          email: item.email ?? '',
          telefono: item.telefono ?? '',
          facebook: item.facebook ?? '',
          instagram: item.instagram ?? '',
          twitter: item.twitter ?? '',
          otrosLideres: item.otrosLideres ?? '',
          otrosParticipantes: item.otrosParticipantes ?? '',
          organizacionesLideresIds: item.organizacionesLideres.map((o) => o.id),
          organizacionesParticipantesIds: item.organizacionesParticipantes.map((o) => o.id),
        });
        this.logo = item.logo;
      });
    }
  }

  uploadLogo(event: FileUploadHandlerEvent): void {
    this.adjuntos.upload(event.files[0]).subscribe((adjunto) => (this.logo = adjunto));
  }

  submit(): void {
    if (this.form.invalid || !this.logo) {
      this.toast.add({ severity: 'warn', summary: 'Faltan datos', detail: !this.logo ? 'Debe indicar un logo.' : 'Complete los campos requeridos.' });
      return;
    }
    this.saving = true;
    const payload = { ...this.form.getRawValue(), logoId: this.logo.id };
    const request$ = this.id ? this.service.update(this.id, payload) : this.service.create(payload);
    request$.subscribe({
      next: () => this.router.navigate(['/admin/iniciativas']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
