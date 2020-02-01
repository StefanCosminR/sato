import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { catchError, filter, flatMap } from 'rxjs/operators';
import { GithubCredential } from 'src/app/models/github/GithubCredential';
import { SPARQLResource } from '../../../models/SPARQLResource';

import { AuthenticationService } from '../../../services/authentication.service';
import { SPARQLEndpointService } from '../../../services/sparqlendpoint.service';
import { UserInterestsService } from '../../../services/user-interests.service';

@Component({
    selector: 'sato-main',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
    public searchInputValue: BehaviorSubject<string>;
    public suggestions: Array<SPARQLResource>;
    public loadingSuggestions: boolean;

    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private sparqlService: SPARQLEndpointService,
                private interestsService: UserInterestsService,
                public authService: AuthenticationService) {
    }

    ngOnInit() {
        this.searchInputValue = new BehaviorSubject<string>('');

        const searchSubscription = this.searchInputValue
            .pipe(
                filter(value => typeof value === 'string' && value !== '')
            )
            .subscribe((newInputValue) => {
                const queryParams: Params = {query: encodeURIComponent(newInputValue)};

                this.router.navigate(
                    ['/search'],
                    {
                        queryParams
                    });
            });

        this.subscriptions.push(searchSubscription);

        this.getUserSuggestions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    private getUserSuggestions(): void {
        let resultsObservable;

        this.loadingSuggestions = true;

        if (!this.authService.credentials) {
            resultsObservable = this.sparqlService.collectPopularSuggestions();
        } else if (this.authService.hasCollectedInterests) {
            resultsObservable = this.collectSuggestions(this.authService.userInterests);
        } else {
            const credential = this.authService.credentials.credential as unknown as GithubCredential;
            resultsObservable = this.interestsService.collectUserInterests(credential.oauthAccessToken || credential.accessToken)
                .pipe(
                    flatMap((interests: Array<string>) => {
                        this.authService.userInterests = interests;
                        this.authService.hasCollectedInterests = true;
                        return this.collectSuggestions(this.authService.userInterests);
                    }),
                    catchError(error => {
                        return throwError(error);
                    })
                );
        }

        resultsObservable.subscribe((suggestions: Array<SPARQLResource>) => {
            this.suggestions = suggestions;
            this.loadingSuggestions = false;
        });
    }

    private collectSuggestions(interests: Array<string>): Observable<Array<SPARQLResource>> {
        if (!!interests.length) {
            return this.sparqlService.suggestFromTopics(interests);
        }
        return this.sparqlService.collectPopularSuggestions();
    }
}
