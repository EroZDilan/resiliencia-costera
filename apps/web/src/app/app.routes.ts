import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { PublicLayoutComponent } from './core/layout/public-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./features/proyecto/public/proyecto-list-public/proyecto-list-public.component').then(
            (m) => m.ProyectoListPublicComponent,
          ),
      },
      {
        path: 'proyectos/:slug',
        loadComponent: () =>
          import('./features/proyecto/public/proyecto-detail-public/proyecto-detail-public.component').then(
            (m) => m.ProyectoDetailPublicComponent,
          ),
      },
      {
        path: 'iniciativas',
        loadComponent: () =>
          import('./features/iniciativa/public/iniciativa-list-public/iniciativa-list-public.component').then(
            (m) => m.IniciativaListPublicComponent,
          ),
      },
      {
        path: 'iniciativas/:slug',
        loadComponent: () =>
          import('./features/iniciativa/public/iniciativa-detail-public/iniciativa-detail-public.component').then(
            (m) => m.IniciativaDetailPublicComponent,
          ),
      },
      {
        path: 'organizaciones',
        loadComponent: () =>
          import('./features/organizacion/public/organizacion-list-public/organizacion-list-public.component').then(
            (m) => m.OrganizacionListPublicComponent,
          ),
      },
      {
        path: 'organizaciones/:slug',
        loadComponent: () =>
          import(
            './features/organizacion/public/organizacion-detail-public/organizacion-detail-public.component'
          ).then((m) => m.OrganizacionDetailPublicComponent),
      },
      {
        path: 'marco-legal',
        loadComponent: () =>
          import('./features/marco-legal/public/marco-legal-list-public/marco-legal-list-public.component').then(
            (m) => m.MarcoLegalListPublicComponent,
          ),
      },
      {
        path: 'marco-legal/:slug',
        loadComponent: () =>
          import('./features/marco-legal/public/marco-legal-detail-public/marco-legal-detail-public.component').then(
            (m) => m.MarcoLegalDetailPublicComponent,
          ),
      },
      {
        path: 'bibliografia',
        loadComponent: () =>
          import('./features/bibliografia/public/bibliografia-list-public/bibliografia-list-public.component').then(
            (m) => m.BibliografiaListPublicComponent,
          ),
      },
      {
        path: 'bibliografia/:slug',
        loadComponent: () =>
          import(
            './features/bibliografia/public/bibliografia-detail-public/bibliografia-detail-public.component'
          ).then((m) => m.BibliografiaDetailPublicComponent),
      },
      {
        path: 'editoriales',
        loadComponent: () =>
          import('./features/editorial/public/editorial-list-public/editorial-list-public.component').then(
            (m) => m.EditorialListPublicComponent,
          ),
      },
      {
        path: 'editoriales/:slug',
        loadComponent: () =>
          import('./features/editorial/public/editorial-detail-public/editorial-detail-public.component').then(
            (m) => m.EditorialDetailPublicComponent,
          ),
      },
      {
        path: 'colaboraciones',
        loadComponent: () =>
          import('./features/colaboracion/public/colaboracion-list-public/colaboracion-list-public.component').then(
            (m) => m.ColaboracionListPublicComponent,
          ),
      },
      {
        path: 'colaboraciones/:slug',
        loadComponent: () =>
          import(
            './features/colaboracion/public/colaboracion-detail-public/colaboracion-detail-public.component'
          ).then((m) => m.ColaboracionDetailPublicComponent),
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/evento/public/evento-list-public/evento-list-public.component').then(
            (m) => m.EventoListPublicComponent,
          ),
      },
      {
        path: 'eventos/:slug',
        loadComponent: () =>
          import('./features/evento/public/evento-detail-public/evento-detail-public.component').then(
            (m) => m.EventoDetailPublicComponent,
          ),
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('./features/noticia/public/noticia-list-public/noticia-list-public.component').then(
            (m) => m.NoticiaListPublicComponent,
          ),
      },
      {
        path: 'noticias/:slug',
        loadComponent: () =>
          import('./features/noticia/public/noticia-detail-public/noticia-detail-public.component').then(
            (m) => m.NoticiaDetailPublicComponent,
          ),
      },
      {
        path: 'glosario',
        loadComponent: () =>
          import('./features/glosario/public/glosario-public.component').then((m) => m.GlosarioPublicComponent),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/public/faq-public.component').then((m) => m.FaqPublicComponent),
      },
      {
        path: 'contactenos',
        loadComponent: () =>
          import('./features/incidencia/public/contactenos/contactenos.component').then(
            (m) => m.ContactenosComponent,
          ),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'proyectos', pathMatch: 'full' },

      { path: 'proyectos', loadComponent: () => import('./features/proyecto/admin/proyecto-list/proyecto-list.component').then((m) => m.ProyectoListComponent) },
      { path: 'proyectos/nuevo', loadComponent: () => import('./features/proyecto/admin/proyecto-form/proyecto-form.component').then((m) => m.ProyectoFormComponent) },
      { path: 'proyectos/:id', loadComponent: () => import('./features/proyecto/admin/proyecto-form/proyecto-form.component').then((m) => m.ProyectoFormComponent) },

      { path: 'organizaciones', loadComponent: () => import('./features/organizacion/admin/organizacion-list/organizacion-list.component').then((m) => m.OrganizacionListComponent) },
      { path: 'organizaciones/nueva', loadComponent: () => import('./features/organizacion/admin/organizacion-form/organizacion-form.component').then((m) => m.OrganizacionFormComponent) },
      { path: 'organizaciones/:id', loadComponent: () => import('./features/organizacion/admin/organizacion-form/organizacion-form.component').then((m) => m.OrganizacionFormComponent) },

      { path: 'provincias', loadComponent: () => import('./features/provincia/admin/provincia-list/provincia-list.component').then((m) => m.ProvinciaListComponent) },
      { path: 'provincias/nueva', loadComponent: () => import('./features/provincia/admin/provincia-form/provincia-form.component').then((m) => m.ProvinciaFormComponent) },
      { path: 'provincias/:id', loadComponent: () => import('./features/provincia/admin/provincia-form/provincia-form.component').then((m) => m.ProvinciaFormComponent) },

      { path: 'municipios', loadComponent: () => import('./features/municipio/admin/municipio-list/municipio-list.component').then((m) => m.MunicipioListComponent) },
      { path: 'municipios/nuevo', loadComponent: () => import('./features/municipio/admin/municipio-form/municipio-form.component').then((m) => m.MunicipioFormComponent) },
      { path: 'municipios/:id', loadComponent: () => import('./features/municipio/admin/municipio-form/municipio-form.component').then((m) => m.MunicipioFormComponent) },

      { path: 'glosario', loadComponent: () => import('./features/glosario/admin/glosario-list/glosario-list.component').then((m) => m.GlosarioListComponent) },
      { path: 'glosario/nuevo', loadComponent: () => import('./features/glosario/admin/glosario-form/glosario-form.component').then((m) => m.GlosarioFormComponent) },
      { path: 'glosario/:id', loadComponent: () => import('./features/glosario/admin/glosario-form/glosario-form.component').then((m) => m.GlosarioFormComponent) },

      { path: 'marco-legal', loadComponent: () => import('./features/marco-legal/admin/marco-legal-list/marco-legal-list.component').then((m) => m.MarcoLegalListComponent) },
      { path: 'marco-legal/nuevo', loadComponent: () => import('./features/marco-legal/admin/marco-legal-form/marco-legal-form.component').then((m) => m.MarcoLegalFormComponent) },
      { path: 'marco-legal/:id', loadComponent: () => import('./features/marco-legal/admin/marco-legal-form/marco-legal-form.component').then((m) => m.MarcoLegalFormComponent) },

      { path: 'bibliografia', loadComponent: () => import('./features/bibliografia/admin/bibliografia-list/bibliografia-list.component').then((m) => m.BibliografiaListComponent) },
      { path: 'bibliografia/nueva', loadComponent: () => import('./features/bibliografia/admin/bibliografia-form/bibliografia-form.component').then((m) => m.BibliografiaFormComponent) },
      { path: 'bibliografia/:id', loadComponent: () => import('./features/bibliografia/admin/bibliografia-form/bibliografia-form.component').then((m) => m.BibliografiaFormComponent) },

      { path: 'editoriales', loadComponent: () => import('./features/editorial/admin/editorial-list/editorial-list.component').then((m) => m.EditorialListComponent) },
      { path: 'editoriales/nueva', loadComponent: () => import('./features/editorial/admin/editorial-form/editorial-form.component').then((m) => m.EditorialFormComponent) },
      { path: 'editoriales/:id', loadComponent: () => import('./features/editorial/admin/editorial-form/editorial-form.component').then((m) => m.EditorialFormComponent) },

      { path: 'colaboraciones', loadComponent: () => import('./features/colaboracion/admin/colaboracion-list/colaboracion-list.component').then((m) => m.ColaboracionListComponent) },
      { path: 'colaboraciones/nueva', loadComponent: () => import('./features/colaboracion/admin/colaboracion-form/colaboracion-form.component').then((m) => m.ColaboracionFormComponent) },
      { path: 'colaboraciones/:id', loadComponent: () => import('./features/colaboracion/admin/colaboracion-form/colaboracion-form.component').then((m) => m.ColaboracionFormComponent) },

      { path: 'eventos', loadComponent: () => import('./features/evento/admin/evento-list/evento-list.component').then((m) => m.EventoListComponent) },
      { path: 'eventos/nuevo', loadComponent: () => import('./features/evento/admin/evento-form/evento-form.component').then((m) => m.EventoFormComponent) },
      { path: 'eventos/:id', loadComponent: () => import('./features/evento/admin/evento-form/evento-form.component').then((m) => m.EventoFormComponent) },

      { path: 'noticias', loadComponent: () => import('./features/noticia/admin/noticia-list/noticia-list.component').then((m) => m.NoticiaListComponent) },
      { path: 'noticias/nueva', loadComponent: () => import('./features/noticia/admin/noticia-form/noticia-form.component').then((m) => m.NoticiaFormComponent) },
      { path: 'noticias/:id', loadComponent: () => import('./features/noticia/admin/noticia-form/noticia-form.component').then((m) => m.NoticiaFormComponent) },

      { path: 'iniciativas', loadComponent: () => import('./features/iniciativa/admin/iniciativa-list/iniciativa-list.component').then((m) => m.IniciativaListComponent) },
      { path: 'iniciativas/nueva', loadComponent: () => import('./features/iniciativa/admin/iniciativa-form/iniciativa-form.component').then((m) => m.IniciativaFormComponent) },
      { path: 'iniciativas/:id', loadComponent: () => import('./features/iniciativa/admin/iniciativa-form/iniciativa-form.component').then((m) => m.IniciativaFormComponent) },

      { path: 'incidencias', loadComponent: () => import('./features/incidencia/admin/incidencia-list/incidencia-list.component').then((m) => m.IncidenciaListComponent) },
      { path: 'incidencias/:id', loadComponent: () => import('./features/incidencia/admin/incidencia-detail/incidencia-detail.component').then((m) => m.IncidenciaDetailComponent) },

      { path: 'configuracion', loadComponent: () => import('./features/configuracion/admin/configuracion-form.component').then((m) => m.ConfiguracionFormComponent) },

      { path: 'faq', loadComponent: () => import('./features/faq/admin/faq-list/faq-list.component').then((m) => m.FaqListComponent) },
      { path: 'faq/nueva', loadComponent: () => import('./features/faq/admin/faq-form/faq-form.component').then((m) => m.FaqFormComponent) },
      { path: 'faq/:id', loadComponent: () => import('./features/faq/admin/faq-form/faq-form.component').then((m) => m.FaqFormComponent) },
    ],
  },
];
