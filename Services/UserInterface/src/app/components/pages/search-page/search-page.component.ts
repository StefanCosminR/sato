import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {SPARQLEndpointService} from '../../../services/sparqlendpoint.service';
import {SPARQLResource} from '../../../models/SPARQLResource';
import {ResourceSearchInput} from '../../../models/ResourceSearchInput';

@Component({
    selector: 'sato-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
    private queryParamsSubscription: Subscription;
    public searchContent: BehaviorSubject<string>;
    public trackedResources: SPARQLResource[];

    private subscriptions: Subscription[] = [];

    readonly ACCEPTED_RESOURCE_TYPES = {
        repositories: 'Repository',
        tutorials: 'Tutorial',
        articles: 'Article',
        news: 'News'
    };
    readonly PAGE_SIZE = 5;

    filterOptions: ResourceSearchInput;
    resources: Array<SPARQLResource>;
    sparqlClassUrl: string;
    totalResources: number;
    resourceType: string;
    loading: boolean;
    page: number;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private http: HttpClient,
                private sparqlEndpoint: SPARQLEndpointService) {

        this.sparqlClassUrl = 'http://www.semanticweb.org/wade/ontologies/sato#Resource';
        this.totalResources = 0;
        this.resourceType = 'Resource';
        this.resources = [];
        this.loading = true;
        this.page = 1;

        this.filterOptions = {
            offset: 0,
            size: this.PAGE_SIZE,
            filters: {
                pattern: ''
            }
        };
    }

    ngOnInit() {
        this.searchContent = new BehaviorSubject<string>('');
        const searchSubscription = this.searchContent
            .pipe(
                filter(value => typeof value === 'string')
            )
            .subscribe(this.onSearchValueChanged.bind(this));

        const queryParamsSubscription = this.route.queryParams.subscribe(param => {
            let query = '';

            if (param.query) {
                query = param.query;
            }

            this.searchContent.next(decodeURIComponent(query));
        });

        this.subscriptions.push(searchSubscription);
        this.subscriptions.push(queryParamsSubscription);




    }

    private onSearchValueChanged(newValue) {
        if (newValue !== '') {
            const queryParams: Params = { query: encodeURIComponent(newValue) };
            this.router.navigate(
                [],
                {
                    relativeTo: this.route,
                    queryParams,
                    queryParamsHandling: 'merge', // remove to replace all query params by provided
                });

            this.filterOptions.filters.pattern = newValue;

            this.initPageResources();

            // this.sparqlEndpoint.searchByTopic(newValue)
            //     .subscribe((resources: SPARQLResource[]) => {
            //         console.log('got resources', resources);
            //         this.trackedResources = resources;
            //     });
        }
    }

    ngOnDestroy() {
        this.searchContent.complete();
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    public apiCallbackFn = (route: string) => {
        return this.http.get(route);
    }

    public collectPageResources = (page: number): void => {
        this.page = page;
        this.loading = true;
        this.filterOptions.offset = (page - 1) * this.PAGE_SIZE;
        this.sparqlEndpoint.collectClassInstances(this.sparqlClassUrl, this.filterOptions)
            .subscribe(resources => {
                this.resources = resources;
                this.loading = false;
            });
    }

    private initPageResources(): void {
        this.loading = true;
        console.log('seaching for', this.sparqlClassUrl);
        this.sparqlEndpoint.countClassInstances(this.sparqlClassUrl, this.filterOptions)
            .subscribe(count => {
                console.log('how many??');
                this.totalResources = count;
                this.collectPageResources(this.page);
            });
    }

}
