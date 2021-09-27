import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { InspectionSite } from 'src/app/models/classes';
import { SearchService, StateService } from 'src/app/providers';

@Component({
  selector: 'detailed',
  templateUrl: './detailed.component.html',
})
export class DetailedComponent implements OnInit {
  site: InspectionSite | undefined;
  constructor(private _state: StateService, private _search: SearchService) { }

  ngOnInit(): void {
    this._state.selected.asObservable().pipe(distinctUntilChanged()).subscribe(selected => {
      if(selected !== undefined) {
        this.handleSelection(selected)
      }
    })
  }
  get address() {
    if (this.site === undefined) return '';
    return `${this.site.street}, ${this.site.city}, FL ${this.site.zipcode}`
  }
  get hoursOfOperation() {
    if (this.site === undefined) return '';
    if (this.site.days === 'N/A' && this.site.hours === 'N/A') return 'N/A';
    return `${this.site.days}: ${this.site.hours}`
  }
  get canGiveDirections(): boolean {
    return (this.site !== undefined && this._search.searchedLocation.address !== undefined)
  }
  handleSelection(id: number) {
    this.site = this._state.getSelectedSite(id)
  }
  onClose() {
    this._state.selected.next(undefined);
    this._state.removeSelectedFeature();
    console.log('close')
  }
  
}
