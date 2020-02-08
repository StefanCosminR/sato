import { Component, Input } from '@angular/core';

@Component({
    selector: 'sato-infinite-load',
    templateUrl: './infinite-load.component.html',
    styleUrls: ['./infinite-load.component.scss']
})
export class InfiniteLoadComponent {
    @Input() loadingMessage: string;
    @Input() loading: boolean;
}
