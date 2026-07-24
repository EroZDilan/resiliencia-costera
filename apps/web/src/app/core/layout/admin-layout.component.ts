import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="layout">
      <nav class="sidebar">
        <h3>Resiliencia Costera — Admin</h3>
        <a routerLink="/admin/incidencias">Incidencias</a>
        <a routerLink="/admin/proyectos">Proyectos</a>
        <a routerLink="/admin/iniciativas">Iniciativas</a>
        <a routerLink="/admin/organizaciones">Organizaciones</a>
        <a routerLink="/admin/noticias">Noticias</a>
        <a routerLink="/admin/eventos">Eventos</a>
        <a routerLink="/admin/editoriales">Editoriales</a>
        <a routerLink="/admin/colaboraciones">Colaboraciones</a>
        <a routerLink="/admin/marco-legal">Marco legal</a>
        <a routerLink="/admin/bibliografia">Bibliografía</a>
        <a routerLink="/admin/glosario">Glosario</a>
        <a routerLink="/admin/faq">FAQ</a>
        <a routerLink="/admin/provincias">Provincias</a>
        <a routerLink="/admin/municipios">Municipios</a>
        <a routerLink="/admin/configuracion">Configuración</a>
        <a routerLink="/proyectos">Ir al sitio público</a>
      </nav>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .layout { display: flex; min-height: 100vh; }
      .sidebar {
        width: 220px;
        flex-shrink: 0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        border-right: 1px solid var(--p-content-border-color, #ddd);
      }
      .content { flex: 1; padding: 1.5rem; }
    `,
  ],
})
export class AdminLayoutComponent {}
