import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import { Extent } from 'src/app/models/classes';
import { StateService } from '.';
export interface EsriSuggestionRequest {
    text: string,
    location?: number[] | { x: number, y: number, spatialReference: { wkid: number } },
    distance?: number, // in meters, reqiures a location
    category?: string, // comma separated list of categories as defined https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm
    searchExtent?: number[],
    maxSuggestions?: number,
    countryCode?: string,
    f: 'html' | 'json' | 'pjson'
}

export interface EsriSuggestion {
    text: string,
    magicKey: string,
    isCollection: boolean
}
export interface EsriSuggestionResponse {
    suggestions: EsriSuggestion[]
}

export interface Location {
    address?: string;
    coordinates?: number[];
    extent?: Extent;
}

@Injectable({providedIn: 'root'})
export class SearchService {

    _suggestions = new BehaviorSubject<EsriSuggestion[]>([]);
    value: EsriSuggestion | undefined;
    currentLocation: Location = {};
    searchedLocation: Location = {};
    constructor(private http: HttpClient, private _state: StateService) { }

    get suggestions() {return this._suggestions.value;}
    set suggestions(value) {
        console.log('setting new suggestions', value);
        this._suggestions.next(value);
    }
    onCurrent() {
        console.log('should be doing something')
        if(this.currentLocation.coordinates !== undefined) {
            this.searchedLocation = this.currentLocation;

            this._state.zoomToPoint(this.currentLocation.coordinates);
            return;
        }
        else {
            window.navigator.geolocation.getCurrentPosition((position) => {
                if(position){
                    this.currentLocation.coordinates = [position.coords.longitude, position.coords.latitude]
                    this.searchedLocation.coordinates = this.currentLocation.coordinates;
                    this.handleSearchedLocation(this.currentLocation.coordinates);

                    this.reverseGeocode(this.currentLocation.coordinates);
                }
            }, function(error) {
                console.log('loser', error.message)
            },{timeout: 100000})
        }

      }
    removeSearchedLocation() {
        this.searchedLocation = {};
        this._state.removeMarker();
    }

    reverseGeocode(coords:number[]) {
    let url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=${coords[0]}%2C${coords[1]}`;
    console.log(url);
        this.http.get(url).subscribe((response: any) => {
            console.log(response);
            if(response && response.address && response.address.Match_addr){
                this.currentLocation.address = response.address.Match_addr;
                this.searchedLocation.address = this.currentLocation.address;
            }
        })
    }
    suggest(request: EsriSuggestionRequest): void {
        // maybe this gets made
        console.log(request);
        let keys = Object.keys(request);
        let values = Object.values(request);
        let urlParameters = '';
        keys.forEach((key, i) => {
            let value = values[i];
            if (key === 'searchExtent' || key === 'location') {
                value = value.join(',');
            }
            else {
                value = encodeURIComponent(value);
            }
            urlParameters += `${key}=${value}`;
            if (i !== (keys.length - 1)) {
                urlParameters += '&';
            }
        });
        let url = this.getUrlBase('suggest') + urlParameters;
        console.log(url);
        this.http.get<EsriSuggestionResponse>(url)
        .subscribe((response: EsriSuggestionResponse) => {
            this.suggestions = response.suggestions;
        });
    }
    findAddressCandidates(suggest: EsriSuggestion) {
        // construct endpoint URL
        let urlOptions = `singleLine=${encodeURIComponent(suggest.text)}&magicKey=${suggest.magicKey}&f=json`;
        let url = this.getUrlBase('findAddressCandidates') + urlOptions;
        return this.http.get(url).pipe(map((response: any) => {
            this.searchedLocation = response.candidates[0];
            console.log(response.candidates[0]);
            let address = response.candidates[0].address;
            let coordinates = [response.candidates[0].location.x, response.candidates[0].location.y]
            
            this.searchedLocation = {address,coordinates};
            this.handleSearchedLocation(coordinates);
            return response.candidates[0];
        }));
    }
    async handleSearchedLocation(coordinates: number[]) {
        this._state.zoomToPoint(coordinates);
        await this._state.removeMarker().then(() => {
            this._state.addMarker(coordinates);
        })
    }

    private getUrlBase = (type: 'suggest' | 'findAddressCandidates') => {
        return `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/${type}?`;
    }
}
