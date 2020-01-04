import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
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

    constructor(private route: ActivatedRoute, private http: HttpClient,
                private sparqlEndpointService: SPARQLEndpointService) {
    }

    ngOnInit() {
        this.searchContent = new BehaviorSubject<string>('');
        this.searchContent
            .pipe(
                filter(value => typeof value === 'string')
            )
            .subscribe(this.onSearchValueChanged.bind(this));
        this.queryParamsSubscription = this.route.queryParams.subscribe(param => {
            this.searchContent.next(param.query);
        });

    }

    private onSearchValueChanged(newValue) {
        if (newValue !== '') {
            this.sparqlEndpointService.searchByTopic(newValue)
                .subscribe((resources: SPARQLResource[]) => {
                    console.log('got resources', resources);
                    this.trackedResources = resources;
                });
        }
        console.log('behaviour subject change to', newValue);
    }

    ngOnDestroy() {
        this.queryParamsSubscription.unsubscribe();
        this.searchContent.unsubscribe();
        this.searchContent.complete();
    }

    public apiCallbackFn = (route: string) => {
        return this.http.get(route);
    };

}
