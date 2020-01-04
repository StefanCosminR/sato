import {ActivatedRoute, Params, Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {filter} from 'rxjs/operators';

@Component({
    selector: 'sato-main',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
    public searchInputValue: BehaviorSubject<string>;
    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute,
                private router: Router) {
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
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }

}
