import {Component, OnInit} from '@angular/core';
import {GithubCredential} from '../../../models/github/GithubCredential';
import {AuthenticationService} from '../../../services/authentication.service';
import {UserInterestsService} from '../../../services/user-interests.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SPARQLResource} from '../../../models/SPARQLResource';
import {SPARQLEndpointService} from '../../../services/sparqlendpoint.service';
import {TurtleNamespace} from '../../../constants/TurtleNamespace';

@Component({
    selector: 'sato-user-interests-page',
    templateUrl: './user-interests-page.component.html',
    styleUrls: ['./user-interests-page.component.scss']
})
export class UserInterestsPageComponent implements OnInit {

    public interests: string[] = [];
    public newInterests = '';
    public topics: BehaviorSubject<SelectItem[]> = new BehaviorSubject<SelectItem[]>([]);
    readonly TOPIC_CLASS = `${TurtleNamespace.SATO}Topic`;
    public topics2 = ["test"];

    constructor(private authService: AuthenticationService,
                private interestsService: UserInterestsService,
                private sparqlEndpoint: SPARQLEndpointService) {
    }

    ngOnInit() {
        this.collectClassInstanceNames(this.TOPIC_CLASS).subscribe(topics => {
            this.topics.next(topics);
        });

        this.getUserInterests();
    }

    public addInterest() {
        this.interests.unshift(this.newInterests);
        this.newInterests = '';
    }

    public deleteInterestsAt(index: number) {
        this.interests.splice(index, 1);
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
            .subscribe(() => {
                this.authService.userInterests = this.interests;
                this.authService.hasCollectedInterests = true;
            }, console.error);
    }

    private collectClassInstanceNames(sparqlClassUrl: string): Observable<Array<SelectItem>> {
        return this.sparqlEndpoint.collectClassInstances(sparqlClassUrl)
            .pipe(
                map((instances: Array<SPARQLResource>) => {
                    return this.preprocessSelectItems(instances);
                })
            );
    }

    private preprocessSelectItems(selectItems: Array<SPARQLResource>): Array<SelectItem> {
        return selectItems
            .map(instance => {
                return {
                    text: instance.url,
                    id: instance.url
                };
            })
            .sort((item1: SelectItem, item2: SelectItem) => item1.text.localeCompare(item2.text))
            .filter(item => {
                if (!!item.id === false) {
                    console.log('why?', item);
                }
                return !!item.id;
            });
    }

}

interface SelectItem {
    id: string;
    text: string;
}
