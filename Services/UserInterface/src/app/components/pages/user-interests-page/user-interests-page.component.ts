import {Component, OnInit} from '@angular/core';
import {GithubCredential} from '../../../models/github/GithubCredential';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserInterestsService} from '../../../services/user-interests.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SPARQLResource} from '../../../models/SPARQLResource';
import {SPARQLEndpointService} from '../../../services/sparqlendpoint.service';
import {RdfNamespace} from '../../../constants/RdfNamespace';
import {IDropdownSettings} from 'ng-multiselect-dropdown';

@Component({
    selector: 'sato-user-interests-page',
    templateUrl: './user-interests-page.component.html',
    styleUrls: ['./user-interests-page.component.scss']
})
export class UserInterestsPageComponent implements OnInit {

    public interests: string[] = [];
    public newInterests: string[] = [];
    public topics: string[] = [];
    readonly TOPIC_CLASS = `${RdfNamespace.SATO}Topic`;
    public multiSelectSettings: IDropdownSettings = {
        unSelectAllText: 'Deselect All',
        selectAllText: 'Select All',
        allowSearchFilter: true,
        singleSelection: true,
        itemsShowLimit: 5
    };

    constructor(private authService: AuthenticationService,
                private interestsService: UserInterestsService,
                private sparqlEndpoint: SPARQLEndpointService) {
    }

    ngOnInit() {
        this.collectClassInstanceNames(this.TOPIC_CLASS).subscribe(topics => {
            this.topics = topics;
        });

        this.getUserInterests();
    }

    public addInterest() {
        if(this.newInterests.length > 0) {
            this.interests.unshift(this.newInterests[0]);
            this.newInterests = [];
        }
    }

    public deleteInterestsAt(index: number) {
        this.interests.splice(index, 1);
    }

    private pushInterestsToBackend() {
        this.authService.userInterests = this.interests;
        const credential = this.authService.credentials.credential as unknown as GithubCredential;
        this.interestsService.setUserInterests(this.interests, credential.oauthAccessToken || credential.accessToken);
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
        this.interestsService.setUserInterests(this.interests, credential.oauthAccessToken || credential.accessToken)
            .subscribe(() => {
                this.authService.userInterests = this.interests;
                this.authService.hasCollectedInterests = true;
            }, console.error);
    }

    private collectClassInstanceNames(sparqlClassUrl: string): Observable<Array<string>> {
        return this.sparqlEndpoint.collectClassInstances(sparqlClassUrl)
            .pipe(
                map((instances: Array<SPARQLResource>) => {
                    return this.preprocessSelectItems(instances);
                })
            );
    }

    private preprocessSelectItems(selectItems: Array<SPARQLResource>): string[] {
        return selectItems
            .map(instance => {
                return instance.url;
            })
            .sort((item1: string, item2: string) => item1.localeCompare(item2));
    }

}
