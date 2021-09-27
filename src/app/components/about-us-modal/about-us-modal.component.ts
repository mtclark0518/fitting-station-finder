import { Component } from "@angular/core";
import { StateService } from "src/app/providers";

@Component({
    selector: 'about-us',
    templateUrl: './about-us-modal.component.html'
})

export class AboutUsModal {
    links: {title: string, href: string}[] = [
        {title: 'FDOT Child Passenger Safety Program (CPS)', href: 'https://www.fdot.gov/safety/2A-Programs/OP/cps.shtm'},
        {title: 'Florida Occupant Protection Coalition (FOPC)', href: 'http://www.floccupantprotection.com'},
        {title: 'Child Restraint Requirements (Florida Statute 316.613)', href: 'http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&Seach_String=&URL=0300=0399/0316/Sections/0316.613.htm'},
        {title: 'Add Your Fitting Station to Our Database', href: 'http://www.floridaoprc/ce/ufl.edu/Document.asp?DocID=1582'},
    ]
    constructor(private _state: StateService) {}
    onClose(){this._state.isShowingAboutUsModal = false;}

}