import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
@Component({ selector: 's4-icon', templateUrl: './icon-button.component.html' })

export class IconButtonComponent implements OnChanges {
    @Input() icon = '';
    @Input() cssClass = '';
    @Input() customIcon = false;
    @Input() iconClass = '';
    @Input() active = false;
    @Output() trigger: EventEmitter<any> = new EventEmitter<any>();
    classList = '';
    ngOnChanges(changes: SimpleChanges) {
        // if (changes.active) { console.log(changes); }
        if (changes.active && changes.active.currentValue === true) {
            this.classList = `${this.cssClass} active`;
        }
        else {
            this.classList = this.cssClass;
        }
    }
    get buttonClass(): string {
        return `s4-btn ${this.classList}`;
    }
    get iconClassList(): string {
        return this.customIcon ? this.iconClass : `fal fa-${this.icon} ${this.iconClass}`;
    }

    onTrigger(): void {
        if (this.trigger) {
            this.trigger.emit();
        }
    }
}
