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
    public newInterests = '';

    constructor(private authService: AuthenticationService,
                private interestsService: UserInterestsService) {
    }

    ngOnInit() {
        this.getUserInterests();
    }

    public addInterest() {
        this.interests.push(this.newInterests);
        this.newInterests = '';
    }

    private getUserInterests() {
        const credential = this.authService.credentials.credential as unknown as GithubCredential;
        const resultsObservable = this.interestsService.collectUserInterests(credential.oauthAccessToken || credential.accessToken);

        resultsObservable.subscribe((interests) => {
            this.interests = interests;
        }, error => {
            console.error('err', error);
        });
    }

    private setUserInterests() {
        const credential = this.authService.credentials.credential as unknown as GithubCredential;
        const resultsObservable = this.interestsService.setUserInterests(this.interests, credential.oauthAccessToken || credential.accessToken)
            .subscribe(console.log, console.error);
    }

}
