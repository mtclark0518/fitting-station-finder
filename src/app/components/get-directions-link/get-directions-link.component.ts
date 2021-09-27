import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { InspectionSite } from "src/app/models/classes";
import { SearchService } from "src/app/providers";
import { titleCase } from "src/app/utilities";

@Component({
    selector: 'directions-link',
    templateUrl: './get-directions-link.component.html'
})

export class GetDirectionsLinkComponent implements OnInit {
    @Input() service: 'google' | 'bing' | 'mapquest';
    @Input() site: InspectionSite | undefined;
    constructor(private _search: SearchService, private cd: ChangeDetectorRef) {
    }
    ngOnInit(): void {
        this.cd.detectChanges();        
    }
    get label(): string {
        if(this.service !== 'mapquest') return titleCase(this.service);
        else return 'MapQuest';
    }
    get imageSrc():string {
        return `assets/images/${this.service}.png`
    }

    getGoogleUrl() {
        if (!this.site) return '';
        const format = (str: string): string => str.split(' ').join('+');
        let address = '';
        if(this._search.searchedLocation && this._search.searchedLocation.address) {
          address = format(this._search.searchedLocation.address);
        }
        if (address !== '') {
            return `https://www.google.com/maps/dir/${address}/${format(this.site.street)},+${format(this.site.city)},+FL`;
        }
        else {
            return '';
        }
        
    }
    getBingUrl() {
        if (!this.site) return '';
        const format = (str: string): string => str.split(',').map(section => section.split(' ').join('%20')).join(',');
        let address = '';
        if (this._search.searchedLocation.address) {
            address = format(this._search.searchedLocation.address);
        }
        if(address !== '') {
            return `https://bing.com/maps/default.aspx?rtp=adr.${address}~adr.${format(this.site.street)},${format(this.site.city)},FL`
        }
        else {
            return '';
        }
        
    }
    getMapQuestUrl() {
        const format = (str: string): string => {
            let segments = str.split(',')
            if(segments.length) {
                let zip = segments.pop();
                let street = segments.shift();
                let city = segments.shift();
                if(zip && city && street) {
                    return `us/florida/${city.trim().toLowerCase().split(' ').join('-')}/${zip.trim()}/${street.trim().toLowerCase().split(' ').join('-')}`
                }
            }
            return '';
        }
        if (this.site && this._search.searchedLocation.address && this._search.searchedLocation.coordinates) {
            let address = format(this._search.searchedLocation.address);
            if (address !== '') {
                return `https://www.mapquest.com/directions/from/${address}-${this._search.searchedLocation.coordinates[1]},${this._search.searchedLocation.coordinates[0]}/to/us/florida/${this.site.city.trim().toLowerCase().split(' ').join('-')}/${this.site.zipcode}/${this.site.street.toLowerCase().split(' ').join('-')}-${this.site.coordinates[1]},${this.site.coordinates[0]}`
            }
            let url = `us/florida/gainesville/32605-5151/1226-nw-23rd-ter-29.663128,-82.358349/to/us/florida/gainesville/32611-2051/250-gale-lemerand-dr-29.649896,-82.350183`

        }
        return '';

    }

    openDirections(){
        let url;
        if(this.service === 'google') {url = this.getGoogleUrl();}
        else if(this.service === 'bing') {url = this.getBingUrl();}
        else {url = this.getMapQuestUrl();}

        if(url !== '') {
            console.log(url);
            let a = document.createElement('a');
            a.href = url;
            a.target = "_blank"
            a.click();
            a.remove();
        }



          
        
      };
}