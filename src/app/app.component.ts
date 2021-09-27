import { Component } from "@angular/core";
import { StateService } from "./providers";

@Component({
  selector: "app",
  template: `
    <navigation></navigation>
    <about-us *ngIf="isShowingModal"></about-us>

    <layout></layout>
  `,
})
export class AppComponent {
  title = "Fitting Station Finder";
  constructor(private _state: StateService) {}
  get isShowingModal() {
    return this._state.isShowingAboutUsModal;
  }
}
