import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, filter } from 'rxjs/operators';

import { AuthenticationService } from '../../../services/authentication.service';
import { GithubCredential } from 'src/app/models/github/GithubCredential';
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
                private interestsService: UserInterestsService,
                public authService: AuthenticationService) {
    }

    ngOnInit() {
        this.searchInputValue = new BehaviorSubject<string>('');

        const serachSubscription = this.searchInputValue
            .pipe(
                filter(value => typeof value === 'string' && value !== '')
            )
            .subscribe((newInputValue) => {
                const queryParams: Params = { query: encodeURIComponent(newInputValue) };

                this.router.navigate(
                    ['/search'],
                    {
                        queryParams
                    });
            });

        this.subscriptions.push(serachSubscription);

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
        this.interestsService
            .collectUserInterests(credential.oauthAccessToken)
            .pipe(
                catchError(error => {
                    return throwError(error);
                })
            )
            .subscribe((interests: Array<string>) => {
                console.log(interests);
                // TODO: get suggestions using the collected interests
                // TODO: this.suggestions = ...;
                this.loadingSuggestions = false;
            });
    }
}
