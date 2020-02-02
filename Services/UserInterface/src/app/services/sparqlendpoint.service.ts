import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ResourceSearchInput } from '../models/ResourceSearchInput';
import { SPARQLResource } from '../models/SPARQLResource';

@Injectable({
    providedIn: 'root'
})
export class SPARQLEndpointService {
    readonly SUGGESTIONS_COUNT = 6;

    private contentTypeHeader = 'application/json';
    private acceptHeader = 'application/ld+json, application/sparql-results+json';

    constructor(private http: HttpClient) {
    }

    public countClassInstances(sparqlClass: string, filterOptions?: ResourceSearchInput): Observable<number> {
        const body = this.constructCountClassInstancesRequestBody(sparqlClass, filterOptions);
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APICountResponse) => {
                return parseInt(apiResponse.results.bindings[0].instances.value, 10);
            }));
    }

    public collectClassInstances(sparqlClass: string,
                                 filterOptions?: ResourceSearchInput): Observable<Array<SPARQLResource>> {
        const body = this.constructCollectClassInstancesRequestBody(sparqlClass, filterOptions);
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APISearchResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
            }));
    }

    public collectPopularSuggestions(): Observable<SPARQLResource[]> {
        const body = this.constructCollectPopularSuggestionsRequestBody();
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APISearchResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
            }));
    }

    public suggestFromTopics(topics: Array<string>): Observable<SPARQLResource[]> {
        const body = this.constructSearchByTopicsRequestBody(topics);
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APISearchResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
            }));
    }

    public searchByTopic(topic: string): Observable<SPARQLResource[]> {
        const body = this.constructSearchByTopicRequestBody(topic);
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APISearchResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
            }));
    }

    public getAllTopics(): Observable<string[]> {
        const query = `
            PREFIX : <http://www.semanticweb.org/wade/ontologies/sato#>
            SELECT DISTINCT ?topic WHERE {
                ?s :hasTopic ?topic
            }
            ORDER BY ?topic
        `;
        const options = this.getSparQlEndpointHttpOptions();
        const body = JSON.stringify({
            query: query.trim().replace('\n', '').replace(/\s+/g, ' ')
        });

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, options)
            .pipe(map(result => {
                // transform result to string[]
                console.log('result', result);
                return ['da'];
            }));
    }

    private getSparQlEndpointHttpOptions(): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                Accept: this.acceptHeader,
                'Content-Type': this.contentTypeHeader
            })
        };
    }

    private constructCountClassInstancesRequestBody(sparqlClassUrl: string, filterOptions?: ResourceSearchInput) {
        const query = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT (COUNT(?s) AS ?instances) WHERE {
                ?s rdf:type <${sparqlClassUrl}>
                ${this.buildSparQlSearchFilter(filterOptions)}
            }`;

        return JSON.stringify({
            query: query.trim().replace('\n', '').replace(/\s+/g, ' ')
        });
    }

    private constructCollectClassInstancesRequestBody(sparqlClassUrl: string, filterOptions?: ResourceSearchInput) {
        const query = `
            PREFIX : <http://www.semanticweb.org/wade/ontologies/sato#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            SELECT (?s AS ?url) WHERE {
                ?s rdf:type <${sparqlClassUrl}> .
                ${this.buildSparQlSearchFilter(filterOptions)}
            }
            ${this.applyResultRestrictions(filterOptions)}`;

        return JSON.stringify({
            query: query.trim().replace('\n', '').replace(/\s+/g, ' ')
        });
    }

    private buildSparQlSearchFilter(filterOptions: ResourceSearchInput): string {
        if (!filterOptions.filters || !Object.values(filterOptions.filters).find(value => !!value)) {
            return '';
        }

        let constraints = 'FILTER (';
        const filters = filterOptions.filters;

        if (filters.pattern) {
            constraints = `${constraints}CONTAINS(STR(?s), "${filters.pattern}") `;
        }
        constraints += ')';
        return constraints;
    }

    private applyResultRestrictions(filterOptions: ResourceSearchInput): string {
        return `OFFSET ${filterOptions.offset} LIMIT ${filterOptions.size}`;
    }

    private constructCollectPopularTopicsRequestBody(limit: number): string {
        const query = `
            PREFIX : <http://www.semanticweb.org/wade/ontologies/sato#>
            SELECT ?topic (COUNT(?topic) AS ?occurrences) {
                ?url :hasTopic ?topic
            }
            GROUP BY ?topic
            ORDER BY DESC(?occurrences)
            LIMIT ${limit}`;

        return JSON.stringify({
            query: query.trim().replace('\n', '').replace(/\s+/g, ' ')
        });
    }

    private constructCollectPopularSuggestionsRequestBody(): string {
        const query = `
            PREFIX : <http://www.semanticweb.org/wade/ontologies/sato#>
            SELECT DISTINCT ?url WHERE {
                ?url :hasTopic ?topic .
                {
                    SELECT ?topic (COUNT(?topic) AS ?occurrences) {
                        ?url :hasTopic ?topic
                    }
                    GROUP BY ?topic
                    ORDER BY DESC(?occurrences)
                    LIMIT 10
                }
            }
            ORDER BY RAND()
            LIMIT ${this.SUGGESTIONS_COUNT}`;

        return JSON.stringify({
            query: query.trim().replace('\n', '').replace(/\s+/g, ' ')
        });
    }

    private constructSearchByTopicsRequestBody(topics: Array<string>): string {
        const query = `
            PREFIX : <http://www.semanticweb.org/wade/ontologies/sato#>
            SELECT DISTINCT ?url {
                ?url :hasTopic ?topic .
                FILTER ${this.constructMultiTopicFilterCondition(topics)} .
            }
            ORDER BY RAND()
            LIMIT ${this.SUGGESTIONS_COUNT}`;

        return JSON.stringify({
            query: query.trim().replace('\n', '').replace(/\s+/g, ' ')
        });
    }

    private constructMultiTopicFilterCondition(topics: Array<string>): string {
        let filter = '(';
        topics.forEach((topic, index) => {
            filter += `CONTAINS(STR(?topic), '${topic}') || CONTAINS(STR(?url), '${topic}')`;
            if (index < topics.length - 1) {
                filter += ' || ';
            }
        });
        filter += ')';
        return filter;
    }

    private constructSearchByTopicRequestBody(topic: string): string {
        const body = {
            query: this.constructQueryForTopic(topic)
        };

        return JSON.stringify(body);
    }

    private constructQueryForTopic(topic: string, pageSize: number = 10, offset: number = 0): string {
        return `
            PREFIX : <http://www.semanticweb.org/wade/ontologies/sato#>
            SELECT DISTINCT ?url {
                ?url :hasTopic ?topic .
                FILTER ((CONTAINS(STR(?topic), "${topic}") || CONTAINS(STR(?url), "${topic}"))) .
                }
            LIMIT ${pageSize} OFFSET ${offset}
    `.trim().replace('\n', '').replace(/\s+/g, ' ');
    }
}

class APISearchResponse {
    head: object;
    results: {
        bindings: Array<{ url: { type: string, value: string } }>
    };
}

class APICountResponse {
    head: object;
    results: {
        bindings: Array<{ instances: { type: string, value: string } }>
    };
}
