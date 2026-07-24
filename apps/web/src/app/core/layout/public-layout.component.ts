import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ConfiguracionService } from '../../features/configuracion/configuracion.service';
import { Configuracion } from '../../features/configuracion/configuracion.model';

// Mirrors src/templates/Front/layout.html.twig + layout_footer.html.twig
// exactly (same ids/classes) so the copied front.css applies unchanged.
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, FormsModule],
  templateUrl: './public-layout.component.html',
})
export class PublicLayoutComponent {
  private configuracionService = inject(ConfiguracionService);

  menuOpen = false;
  searchOpen = false;
  searchTerm = '';
  configuracion: Configuracion | null = null;

  constructor() {
    this.configuracionService.getPublic().subscribe((c) => (this.configuracion = c));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
  }

  // TODO: global search endpoint not migrated yet (DefaultController::searchAction).
  submitSearch(): void {}
}
