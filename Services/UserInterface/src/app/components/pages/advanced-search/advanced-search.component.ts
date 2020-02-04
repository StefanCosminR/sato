import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TurtleNamespace } from '../../../constants/TurtleNamespace';
import { ResourceSearchInput } from '../../../models/ResourceSearchInput';
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
    readonly RESOURCE_CLASS = `${TurtleNamespace.SATO}Resource`;
    readonly TOPIC_CLASS = `${TurtleNamespace.SATO}Topic`;
    readonly PAGE_SIZE = 5;

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

    public searchResults: Array<SPARQLResource>;
    public toggledSearch: boolean;
    public totalResults: number;
    public page: number;

    public multiSelectSettings: IDropdownSettings = {
        unSelectAllText: 'UnSelect All',
        selectAllText: 'Select All',
        allowSearchFilter: true,
        singleSelection: false,
        itemsShowLimit: 5
    };

    constructor(private sparqlEndpoint: SPARQLEndpointService) {
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

        this.toggledSearch = false;
        this.searchResults = [];
        this.totalResults = 0;
        this.page = 1;
    }

    ngOnInit() {
        this.collectClassInstanceNames(this.TOPIC_CLASS).subscribe(topics => {
            this.topics = topics;
        });

        this.collectClassInstanceNames(this.PROGRAMMING_LANGUAGE_CLASS).subscribe(programmingLanguages => {
            this.programmingLanguages = programmingLanguages;
        });
    }

    public submitSearch = (): void => {
        const filterOptions = this.buildResourceFilterOptions(1);
        this.sparqlEndpoint.countClassInstances(this.RESOURCE_CLASS, filterOptions).subscribe(count => {
            this.totalResults = count;
            this.collectResourcePage(1);
        });
    }

    public collectResourcePage = (page): void => {
        // TODO include dateRange filtering
        const filterOptions = this.buildResourceFilterOptions(page);
        this.sparqlEndpoint.collectClassInstances(this.RESOURCE_CLASS, filterOptions).subscribe(results => {
            this.searchResults = results;
            this.toggledSearch = true;
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
        return this.sparqlEndpoint.collectClassInstances(sparqlClassUrl)
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

    private buildResourceFilterOptions(page: number): ResourceSearchInput {
        return {
            offset: (page - 1) * this.PAGE_SIZE,
            size: this.PAGE_SIZE,
            filters: {
                programmingLanguages: this.selectedProgrammingLanguages.map(language => language.text),
                languages: this.selectedLanguages.map(language => language.text),
                platforms: this.selectedPlatforms.map(platform => platform.text),
                includedTopics: this.selectedTopics.map(topic => topic.text),
                excludedTopics: this.excludedTopics.map(topic => topic.text),
                pattern: this.searchedPattern
            }
        };
    }
}
