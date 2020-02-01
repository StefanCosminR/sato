import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SPARQLResource } from '../../../models/SPARQLResource';

@Component({
    selector: 'sato-resources-list',
    templateUrl: './resources-list.component.html',
    styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit {
    readonly ACCEPTED_RESOURCE_TYPES = {
        'articles': ':Article',
        'tutorials': ':Tutorial',
        'repositories': 'Repository'
    };

    resources: Array<SPARQLResource>;
    sparqlClass: string;
    pattern: string;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router) {
        this.sparqlClass = '';
        this.resources = [];
        this.pattern = '';
    }

    ngOnInit() {
        // TODO get first page of resources
        // TODO [NiceToHave] persist filter options between refreshes
        this.route.paramMap.subscribe(params => {
            const resourceType = params.get('resourceType');
            if (!Object.keys(this.ACCEPTED_RESOURCE_TYPES).find(type => type === resourceType)) {
                this.router.navigate(['catalog']).then();
            }
            this.sparqlClass = this.ACCEPTED_RESOURCE_TYPES[resourceType];
        });
    }

    public search(): void {

    }

    public apiCallbackFunction(route: string): Observable<any> {
        return this.http.get(route);
    }
}
