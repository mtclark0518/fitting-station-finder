import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { InspectionSite } from 'src/app/models/classes';
import { StateService } from 'src/app/providers';

@Component({
  selector: 'card-list',
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit {
  cards: InspectionSite[] = [];
  constructor(private _state: StateService) { }

  ngOnInit(): void {
    this._state.cardList.asObservable().pipe(distinctUntilChanged()).subscribe(cards => {
      this.cards = cards;
    })
  }
  get hasCards() { return this.cards.length > 0 }
}
