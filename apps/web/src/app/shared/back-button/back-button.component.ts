import { Location } from '@angular/common';
import { Component, Input, inject } from '@angular/core';

// Mirrors src/templates/Front/layout_back_button.html.twig's backButton block
// (same ids so front.css applies unchanged).
@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <div>
      <a href="javascript:void(0)" (click)="goBack()">
        <div id="back_button"></div>
      </a>
      <span id="back_text">{{ text }}</span>
    </div>
  `,
})
export class BackButtonComponent {
  @Input() text = '';
  private location = inject(Location);

  goBack(): void {
    this.location.back();
  }
}
