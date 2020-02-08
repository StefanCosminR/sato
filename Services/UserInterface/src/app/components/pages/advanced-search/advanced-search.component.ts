import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
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
    public resourceTypes: Array<SelectItem>;
    public languages: Array<SelectItem>;
    public platforms: Array<SelectItem>;
    public topics: Array<SelectItem>;
    public searchedPattern: string;

    @ViewChild('startDatePicker', {static: false}) startDate: MatDatepicker<any>;
    @ViewChild('endDatePicker', {static: false}) endDate: MatDatepicker<any>;
    public selectedProgrammingLanguages: Array<SelectItem>;
    public selectedResourceTypes: Array<SelectItem>;
    public selectedLanguages: Array<SelectItem>;
    public selectedPlatforms: Array<SelectItem>;
    public selectedTopics: Array<SelectItem>;
    public excludedTopics: Array<SelectItem>;

    public searchResults: Array<SPARQLResource>;
    public loadingResults: boolean;
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
        this.resourceTypes = [];
        this.topics = [];

        this.languages = this.initLanguageOptions();
        this.platforms = this.initPlatformOptions();
        this.selectedProgrammingLanguages = [];
        this.selectedResourceTypes = [];
        this.selectedTopics = [];
        this.excludedTopics = [];

        this.loadingResults = false;
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

        this.sparqlEndpoint.collectSubClassesOf(this.RESOURCE_CLASS).subscribe(resourceTypes => {
            this.resourceTypes = this.preprocessSelectItems(resourceTypes);
        });
    }

    public submitSearch = (): void => {
        this.page = 1;
        this.loadingResults = true;
        const filterOptions = this.buildResourceFilterOptions(this.page);
        this.sparqlEndpoint.countClassInstances(this.RESOURCE_CLASS, filterOptions).subscribe(count => {
            this.totalResults = count;
            this.collectResourcePage(this.page);
        });
    }

    public collectResourcePage = (page): void => {
        // TODO include dateRange filtering
        this.loadingResults = true;
        const filterOptions = this.buildResourceFilterOptions(page);
        this.sparqlEndpoint.collectClassInstances(this.RESOURCE_CLASS, filterOptions).subscribe(results => {
            this.searchResults = results;
            this.loadingResults = false;
            this.toggledSearch = true;
            this.page = page;
        });
    }

    public resetFilters(): void {
        this.selectedProgrammingLanguages = [];
        this.selectedResourceTypes = [];
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
                    return this.preprocessSelectItems(instances);
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
            {id: 'android', text: 'android'},
            {id: 'ios', text: 'ios'},
            {id: 'linux', text: 'linux'},
            {id: 'windows', text: 'windows'}
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
                resourceTypes: this.selectedResourceTypes.map(type => type.text),
                includedTopics: this.selectedTopics.map(topic => topic.text),
                excludedTopics: this.excludedTopics.map(topic => topic.text),
                pattern: this.searchedPattern,
                dateRange: {
                    startDate: this.startDate.startAt,
                    endDate: this.endDate.startAt
                }
            }
        };
    }

    private preprocessSelectItems(selectItems: Array<SPARQLResource>): Array<SelectItem> {
        return selectItems
            .map(instance => {
                const hashTagIndex = instance.url.lastIndexOf('#');
                const instanceName = instance.url.substr(hashTagIndex + 1);
                return {id: instanceName, text: instanceName};
            })
            .sort((item1: SelectItem, item2: SelectItem) => item1.text.localeCompare(item2.text))
            .filter(item => !!item.id);
    }
}
