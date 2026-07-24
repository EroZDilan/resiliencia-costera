import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OrganizacionService } from '../../organizacion.service';
import { AdjuntoService } from '../../../../core/adjunto/adjunto.service';
import { Adjunto } from '../../../../core/adjunto/adjunto.service';

@Component({
  selector: 'app-organizacion-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './organizacion-form.component.html',
  styleUrl: './organizacion-form.component.scss',
})
export class OrganizacionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(OrganizacionService);
  private adjuntos = inject(AdjuntoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(MessageService);

  id: number | null = null;
  logo: Adjunto | null = null;
  saving = false;

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    email: [''],
    telefono: [''],
    facebook: [''],
    web: [''],
    instagram: [''],
    twitter: [''],
  });

  get logoUrl(): string | null {
    return this.adjuntos.url(this.logo);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.findOne(this.id).subscribe((org) => {
        this.form.patchValue({
          nombre: org.nombre,
          descripcion: org.descripcion,
          email: org.email ?? '',
          telefono: org.telefono ?? '',
          facebook: org.facebook ?? '',
          web: org.web ?? '',
          instagram: org.instagram ?? '',
          twitter: org.twitter ?? '',
        });
        this.logo = org.logo;
      });
    }
  }

  uploadLogo(event: FileUploadHandlerEvent): void {
    const file = event.files[0];
    this.adjuntos.upload(file).subscribe((adjunto) => (this.logo = adjunto));
  }

  submit(): void {
    if (this.form.invalid || !this.logo) {
      this.toast.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail: !this.logo ? 'Debe indicar un logo para la organización.' : 'Complete los campos requeridos.',
      });
      return;
    }
    this.saving = true;
    const payload = { ...this.form.getRawValue(), logoId: this.logo.id };
    const request$ = this.id
      ? this.service.update(this.id, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/admin/organizaciones']),
      error: (err) => {
        this.saving = false;
        this.toast.add({ severity: 'error', summary: 'Error', detail: err.error?.message ?? 'No se pudo guardar' });
      },
    });
  }
}
