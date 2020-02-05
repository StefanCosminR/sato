import {Component, OnInit} from '@angular/core';
import {GithubCredential} from '../../../models/github/GithubCredential';
import {catchError, flatMap, map} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserInterestsService} from '../../../services/user-interests.service';

@Component({
    selector: 'sato-user-interests-page',
    templateUrl: './user-interests-page.component.html',
    styleUrls: ['./user-interests-page.component.scss']
})
export class UserInterestsPageComponent implements OnInit {

    public interests: string[] = [];

    constructor(private authService: AuthenticationService,
                private interestsService: UserInterestsService) {
    }

    ngOnInit() {
        this.getUserInterests();
        // this.setUserInterests();
    }

    private getUserInterests() {
        console.log('searching');
        const credential = this.authService.credentials.credential as unknown as GithubCredential;
        const resultsObservable = this.interestsService.collectUserInterests(credential.oauthAccessToken || credential.accessToken);
        // .pipe(
        //     map((interests: string[]) => {
        //         console.log('some interests', interests);
        //     }),
        //     catchError(error => {
        //         console.log('haaa');
        //         return throwError(error);
        //     })
        // );

        resultsObservable.subscribe((interests) => {
            this.interests = interests;
        }, error => {
            console.error('e', error);
        });
    }

    private setUserInterests() {
        const interests = ['nimic', 'mai mult nimic', 'ASM'];
        const credential = this.authService.credentials.credential as unknown as GithubCredential;
        const resultsObservable = this.interestsService.setUserInterests(interests, credential.oauthAccessToken || credential.accessToken)
            .subscribe(console.log, console.error);

    }

}
