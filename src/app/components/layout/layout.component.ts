import { Component } from '@angular/core';
import { StateService } from 'src/app/providers';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  // isReady: boolean;
  _isMapLoaded = false;
  _activePanels: string;
  constructor(private _state: StateService) {}

  get activePanels(){
    const activePanels = this._state.activePanels;
      if(activePanels !== this._activePanels) {
    console.log(activePanels)

        // this._state.updateMapPadding();
      }
      this._activePanels = activePanels;
      return activePanels;
    
  }
  get isMapLoaded() {return this._isMapLoaded; }
  set isMapLoaded(value) {this._isMapLoaded = value;}

  public onMapLoad = (e: boolean) => {
   this._state.updateMapPadding(); 
    this.isMapLoaded = true;
  }
}
