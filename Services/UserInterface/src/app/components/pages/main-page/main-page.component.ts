import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
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
    public loadingSuggestions: boolean;
    public suggestions: Array<any>;

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

        if (!!this.authService.credentials) {
            this.collectSuggestions();
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

    private collectSuggestions(): void {
        this.loadingSuggestions = true;
        const credential = this.authService.credentials.credential as unknown as GithubCredential;
        this.interestsService.collectUserInterests(credential.oauthAccessToken)
            .pipe(
                flatMap((interests: Array<string>) => {
                    return this.sparqlService.suggestFromTopics(interests);
                }),
                catchError(error => {
                    return throwError(error);
                })
            )
            .subscribe((suggestions: Array<SPARQLResource>) => {
                console.log(suggestions);
                this.suggestions = suggestions;
                this.loadingSuggestions = false;
            });
    }
}
