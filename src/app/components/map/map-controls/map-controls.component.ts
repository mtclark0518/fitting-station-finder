import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService, StateService } from 'src/app/providers';
import { EsriSearchComponent } from '../..';

@Component({
  selector: 'map-controls',
  templateUrl: './map-controls.component.html',
  styles: [
  ]
})
export class MapControlsComponent {
  @ViewChild('search') searchBar: EsriSearchComponent;
  constructor(private _state: StateService, private _search: SearchService) { }

    get map() { return this._state.map; }
  
    get isAtMaxZoom(): boolean {
      return (this.map.getZoom() === this.map.getMaxZoom());
    }

    get isAtMinZoom(): boolean {
      return (this.map.getZoom() === this.map.getMinZoom());
    }

    onCurrent(){
      this._search.onCurrent();
      this.searchBar.text = 'Current Location';
    }

    onZoomIn() {
      this.map.zoomIn();
    }

    onZoomOut() {
      this.map.zoomOut();
    }
}

