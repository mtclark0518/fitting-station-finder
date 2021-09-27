import { Component, OnInit } from '@angular/core';
import { StateService } from '../providers';

@Component({
  selector: 'navigation',
  template: `
  <div class="nav sticky-top d-flex flex-row justify-content-between align-items-center px-1 box-shadow-main">
    <div class="w25 h100 d-flex justify-content-start align-items-center">
      <img style="height: 45px;" src="assets/images/baby.png" alt="baby"/>
      <img style="height: 45px;" src="assets/images/fitting-station-finder.png" alt="Fitting Station Finder"/>
      <div class="pos-rel">
        <img class="pos-abs" style="height: 45px; top: -21px; left:-16px;" src="assets/images/florida_border.svg" alt="Florida"/>
      </div>
    </div>
    <div class="grow centered">Search for child fitting stations in Florida</div>
    <div class="w25 h100 d-flex justify-content-end align-items-center"><s4-icon icon="info-circle" cssClass="std bg-transparent search-bar-icon" (trigger)="showAboutUs()"></s4-icon></div>
  </div>
  `,
})
export class NavigationComponent  {

  constructor(private _state: StateService) { }

  showAboutUs(){
    this._state.isShowingAboutUsModal = true;
  }
}
