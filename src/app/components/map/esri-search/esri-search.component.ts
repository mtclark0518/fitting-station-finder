import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Extent } from 'src/app/models/classes';
import { EsriSuggestion, EsriSuggestionRequest, SearchService, StateService } from 'src/app/providers';
import { extentAsNumberArray } from 'src/app/utilities';
@Component({
    selector: 'esri-search',
    templateUrl: './esri-search.component.html'
})

export class EsriSearchComponent implements OnChanges, AfterViewInit {
    @Input() hasInitialValue = false;
    @Output() valueChange = new EventEmitter<any>();
    @Output() focusChange = new EventEmitter<boolean>();
    _text = '';
    isOpen = false;
    inputStyle = 'round' 

    constructor(
        private _searchService: SearchService,
        private _state: StateService) { }

    ngAfterViewInit() {
        if (!this.hasInitialValue) {
            this.onClear();
        }
        console.log(this.text, this.suggestions, this.value);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.networkType && !changes.networkType.firstChange) {
            this.suggestions = [];
        }
    }

    get value() { return this._searchService.value; }
    set value(v) { this._searchService.value = v; }
    get suggestions() { return this._searchService.suggestions; }
    set suggestions(value) { this._searchService.suggestions = value; }
    get text() { return this._text; }
    set text(value) { this._text = value; }
    get classList() { return `esri-search-wrapper ${this.inputStyle} ${this.isOpen ? 'open' : ''}`; }
    get placeholder() { return "Type an address to search"; }

    get defaultExtent() {
        return this._state.defaultExtent;
    }
    onBlur() {
        this.isOpen = false;
        this.focusChange.emit(false);
    }

    onClear() {
        this.text = '';
        this.suggestions = [];
        this.value = undefined;
        this.isOpen = false;
    }

    onFilter() {
        let shouldReact = this.text.trim().length >= 3;
        if (shouldReact) {
            this.getSuggestions();
            this.isOpen = true;
        }
        else {
            console.log('not searching yet');
            this.isOpen = false;
        }
    }

    onFocus() {
        this.focusChange.emit(true);
    }

    onCurrent(){
        console.log('clicked')
        this._searchService.onCurrent();
        this.text = 'Current Location';
    }
    onSelect(value?: EsriSuggestion) {
        console.log('selected ', value);
        this.value = value;
        if (value) {
            this.text = value.text;
            this._searchService.findAddressCandidates(value).subscribe((response: any) => {
                this.valueChange.emit(response);
            });
        }
        else {
            this.text = '';
            this.valueChange.emit(undefined);
            this._searchService.removeSearchedLocation();
        }
        this.onBlur();
    }

    private getSuggestions() {
        let searchExtent: number[] = extentAsNumberArray(this.defaultExtent);
        let mapCenter = this._state.map.getCenter();
        let location = [mapCenter.lng, mapCenter.lat];

        let request: EsriSuggestionRequest = {
            text: this.text,
            // category: 'address',
            location,
            searchExtent: searchExtent,
            f: 'json'
        };
        this._searchService.suggest(request);
    }
}
