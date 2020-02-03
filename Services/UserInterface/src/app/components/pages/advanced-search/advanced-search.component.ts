import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TurtleNamespace } from '../../../constants/TurtleNamespace';
import { SPARQLResource } from '../../../models/SPARQLResource';
import { SPARQLEndpointService } from '../../../services/sparqlendpoint.service';

interface SelectItem {
    id: string;
    text: string;
}

@Component({
    selector: 'sato-advanced-search',
    templateUrl: './advanced-search.component.html',
    styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
    readonly PROGRAMMING_LANGUAGE_CLASS = `${TurtleNamespace.SATO}ProgrammingLanguage`;
    readonly TOPIC_CLASS = `${TurtleNamespace.SATO}Topic`;

    public programmingLanguages: Array<SelectItem>;
    public languages: Array<SelectItem>;
    public platforms: Array<SelectItem>;
    public topics: Array<SelectItem>;
    public searchedPattern: string;

    public selectedProgrammingLanguages: Array<SelectItem>;
    public selectedLanguages: Array<SelectItem>;
    public selectedPlatforms: Array<SelectItem>;
    public selectedTopics: Array<SelectItem>;
    public excludedTopics: Array<SelectItem>;

    public multiSelectSettings: IDropdownSettings = {
        unSelectAllText: 'UnSelect All',
        selectAllText: 'Select All',
        allowSearchFilter: true,
        singleSelection: false,
        itemsShowLimit: 5
    };

    constructor(private sparqlEndpointService: SPARQLEndpointService) {
        this.programmingLanguages = [];
        this.selectedPlatforms = [];
        this.selectedLanguages = [];
        this.searchedPattern = '';
        this.topics = [];

        this.languages = this.initLanguageOptions();
        this.platforms = this.initPlatformOptions();
        this.selectedProgrammingLanguages = [];
        this.selectedTopics = [];
        this.excludedTopics = [];
    }

    ngOnInit() {
        this.collectClassInstanceNames(this.TOPIC_CLASS).subscribe(topics => {
            this.topics = topics;
        });

        this.collectClassInstanceNames(this.PROGRAMMING_LANGUAGE_CLASS).subscribe(programmingLanguages => {
            this.programmingLanguages = programmingLanguages;
        });
    }

    public resetFilters(): void {
        this.selectedProgrammingLanguages = [];
        this.selectedLanguages = [];
        this.selectedPlatforms = [];
        this.searchedPattern = '';
        this.selectedTopics = [];
        this.excludedTopics = [];
    }

    private collectClassInstanceNames(sparqlClassUrl: string): Observable<Array<SelectItem>> {
        return this.sparqlEndpointService.collectClassInstances(sparqlClassUrl)
            .pipe(
                map((instances: Array<SPARQLResource>) => {
                    return instances
                        .map(instance => {
                            const hashTagIndex = instance.url.lastIndexOf('#');
                            const instanceName = instance.url.substr(hashTagIndex + 1);
                            return {id: instanceName, text: instanceName};
                        })
                        .sort((item1: SelectItem, item2: SelectItem) => item1.text.localeCompare(item2.text))
                        .filter(item => !!item.id);
                })
            );
    }

    private initLanguageOptions(): Array<SelectItem> {
        return [
            {id: 'English', text: 'English'},
            {id: 'Romanian', text: 'Romanian'}
        ];
    }

    private initPlatformOptions(): Array<SelectItem> {
        return [
            {id: 'Android', text: 'Android'},
            {id: 'iOS', text: 'iOS'},
            {id: 'Linux', text: 'Linux'},
            {id: 'Windows', text: 'Windows'}
        ];
    }
}
