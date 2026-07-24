import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';

// Leaflet's default marker icons break once bundled because Icon.Default
// auto-detects an imagePath and prepends it to iconUrl/shadowUrl — so we
// can't just hand it full relative paths (Leaflet would prepend the
// detected path on top of them). Point imagePath at the copy served from
// /leaflet-images instead (see angular.json) and leave the filenames as-is.
(L.Icon.Default as unknown as { imagePath: string }).imagePath = '/leaflet-images/';

export interface MapMarker {
  nombre: string;
  lat: number;
  lng: number;
}

// Replaces the legacy Cartografia module for this one real use case: showing
// a Proyecto's ProyectoLugar rows as simple markers (no drawing/editing, no
// routing — that was all dead transport-routes code, see migration plan).
@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  template: `<div #mapContainer class="leaflet-map"></div>`,
  styles: [
    `
      .leaflet-map {
        width: 100%;
        height: 400px;
        border-radius: 8px;
      }
    `,
  ],
})
export class LeafletMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() markers: MapMarker[] = [];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markerLayer?: L.LayerGroup;

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([21.5, -79.5], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    this.markerLayer = L.layerGroup().addTo(this.map);
    this.renderMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && this.map) {
      this.renderMarkers();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderMarkers(): void {
    if (!this.markerLayer) return;
    this.markerLayer.clearLayers();
    const points = this.markers.filter((m) => !isNaN(m.lat) && !isNaN(m.lng));
    points.forEach((m) => {
      L.marker([m.lat, m.lng]).addTo(this.markerLayer!).bindPopup(m.nombre);
    });
    if (points.length) {
      this.map?.fitBounds(points.map((p) => [p.lat, p.lng] as [number, number]), {
        padding: [30, 30],
      });
    }
  }
}
