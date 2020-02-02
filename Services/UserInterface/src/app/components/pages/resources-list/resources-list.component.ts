import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourceSearchInput } from '../../../models/ResourceSearchInput';
import { SPARQLResource } from '../../../models/SPARQLResource';
import { SPARQLEndpointService } from '../../../services/sparqlendpoint.service';

@Component({
    selector: 'sato-resources-list',
    templateUrl: './resources-list.component.html',
    styleUrls: ['./resources-list.component.scss']
})
export class ResourcesListComponent implements OnInit {
    readonly SATO_RESOURCE_URL = 'http://www.semanticweb.org/wade/ontologies/sato#';
    readonly ACCEPTED_RESOURCE_TYPES = {
        repositories: 'Repository',
        tutorials: 'Tutorial',
        articles: 'Article'
    };
    readonly PAGE_SIZE = 5;

    filterOptions: ResourceSearchInput;
    resources: Array<SPARQLResource>;
    sparqlClassUrl: string;
    totalResources: number;
    resourceType: string;
    page: number;

    constructor(private sparqlEndpoint: SPARQLEndpointService,
                private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router) {
        this.filterOptions = {
            offset: 0,
            size: this.PAGE_SIZE,
            filters: {
                pattern: ''
            }
        };
        this.sparqlClassUrl = '';
        this.totalResources = 0;
        this.resourceType = '';
        this.resources = [];
        this.page = 1;
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const resourceType = params.get('resourceType');
            if (!Object.keys(this.ACCEPTED_RESOURCE_TYPES).find(type => type === resourceType)) {
                this.router.navigate(['catalog']).then();
            }
            this.resourceType = this.ACCEPTED_RESOURCE_TYPES[resourceType];
            this.sparqlClassUrl = `${this.SATO_RESOURCE_URL}${this.ACCEPTED_RESOURCE_TYPES[resourceType]}`;
            this.initPageResources();
        });
    }

    public search(): void {
        this.page = 1;
        this.resources = [];
        this.totalResources = 0;
        this.initPageResources();
    }

    public collectPageResources(page: number): void {
        this.filterOptions.offset = (page - 1) * this.PAGE_SIZE;
        this.sparqlEndpoint.collectClassInstances(this.sparqlClassUrl, this.filterOptions)
            .subscribe(resources => {
                console.log(resources);
                this.resources = resources;
            });
    }

    public apiCallbackFunction(route: string): Observable<any> {
        try {
            return this.http.get(route);
        } catch (error) {
            console.error('Error on route: ', route);
        }
    }

    private initPageResources(): void {
        this.sparqlEndpoint.countClassInstances(this.sparqlClassUrl, this.filterOptions)
            .subscribe(count => {
                this.totalResources = count;
                this.collectPageResources(this.page);
            });
    }
}
