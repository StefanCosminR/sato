import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SPARQLResource } from '../../../models/SPARQLResource';

@Component({
    selector: 'sato-paginated-results-list',
    templateUrl: './paginated-results-list.component.html',
    styleUrls: ['./paginated-results-list.component.scss']
})
export class PaginatedResultsListComponent {
    readonly PAGE_SIZE = 5;

    @Input() onPageChange: (page: number) => void;
    @Input() resources: Array<SPARQLResource>;
    @Input() totalResources: number;
    @Input() resourceType?: string;
    @Input() page: number;

    constructor(private http: HttpClient) {
    }

    public apiCallbackFunction = (route: string): Observable<any> => {
        try {
            return this.http.get(route);
        } catch (error) {
            console.error('Error on route: ', route);
        }
    }
}
