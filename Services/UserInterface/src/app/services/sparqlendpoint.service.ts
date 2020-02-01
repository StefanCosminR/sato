import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
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

    public collectPopularSuggestions(): Observable<SPARQLResource[]> {
        const body = this.constructCollectPopularSuggestionsRequestBody();
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APIResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
            }));
    }

    public suggestFromTopics(topics: Array<string>): Observable<SPARQLResource[]> {
        const body = this.constructSearchByTopicsRequestBody(topics);
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APIResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
            }));
    }

    public searchByTopic(topic: string): Observable<SPARQLResource[]> {
        const body = this.constructSearchByTopicRequestBody(topic);
        const httpOptions = this.getSparQlEndpointHttpOptions();

        return this.http.post(environment.apiEndpoints.sparqlQuery, body, httpOptions)
            .pipe(map((apiResponse: APIResponse) => {
                return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
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

    private constructCollectPopularTopicsRequestBody(limit: number) {
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

class APIResponse {
    head: object;
    results: {
        bindings: Array<{ url: { type: string, value: string } }>
    };
}
