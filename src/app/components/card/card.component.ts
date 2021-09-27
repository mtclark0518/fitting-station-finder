import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { InspectionSite } from 'src/app/models/classes';
import { StateService } from 'src/app/providers';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() card: InspectionSite;
  
  @HostListener('mouseenter')
  onMouseOver() {
    if(!this.isHovered) {
      this._state.setFeatureState("hovered", true, this.card.id);
      this._state.hovered.next(this.card.id);
    }
  }

  @HostListener('mouseleave')
  onMouseOut() {
    if(this.isHovered) {
      this._state.setFeatureState("hovered", false, this.card.id);
      this._state.hovered.next(undefined);
    }

  }
  constructor(private _state: StateService) { }

  get hasDistance() {return this.card.distance !== undefined; }
  get isHovered():boolean {return this._state.hovered.value === this.card.id; }
  get isSelected():boolean {return this._state.selected.value === this.card.id; }
  get operatingDays() {return this.card.days }
  get operatingHours() {
    if (this.operatingDays === 'N/A') return '';
    return this.card.hours;
  }
  public onSelect = () => {
    this._state.select(this.card.id);
  }

}
