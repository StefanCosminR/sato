import { Component, Input } from '@angular/core';
import { SPARQLResource } from '../../../models/SPARQLResource';

@Component({
    selector: 'sato-suggestions-layout',
    templateUrl: './suggestions-layout.component.html',
    styleUrls: ['./suggestions-layout.component.scss']
})
export class SuggestionsLayoutComponent {
    @Input() suggestions: Array<SPARQLResource>;
}
