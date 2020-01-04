import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'sato-main-menu-bar',
    templateUrl: './main-menu-bar.component.html',
    styleUrls: ['./main-menu-bar.component.scss']
})
export class MainMenuBarComponent implements OnInit {
    @Input() showSearch: boolean;
    @Input() searchInputValue: BehaviorSubject<string>;

    // tslint:disable-next-line:variable-name
    public _searchInputValue = '';

    constructor() {
    }

    ngOnInit() {
        if (this.showSearch === true) {
            this._searchInputValue = this.searchInputValue.getValue();
        }
    }
}
