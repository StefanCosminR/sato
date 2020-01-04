import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Link, NgxLinkifyjsService} from 'ngx-linkifyjs';
import {HttpClient} from '@angular/common/http';
import {SPARQLEndpointService} from '../../../services/sparqlendpoint.service';
import {SPARQLResource} from '../../../models/SPARQLResource';

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

    constructor(private route: ActivatedRoute,
                private router: Router,
                private http: HttpClient,
                private sparqlEndpointService: SPARQLEndpointService) {
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

            this.sparqlEndpointService.searchByTopic(newValue)
                .subscribe((resources: SPARQLResource[]) => {
                    console.log('got resources', resources);
                    this.trackedResources = resources;
                });
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

}
