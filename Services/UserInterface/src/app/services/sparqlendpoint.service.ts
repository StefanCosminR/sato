import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SPARQLResource} from '../models/SPARQLResource';

@Injectable({
  providedIn: 'root'
})
export class SPARQLEndpointService {
  private endpoint = 'http://localhost:8080/sparql';
  private acceptHeader = 'application/ld+json, application/sparql-results+json';
  private contentTypeHeader = 'application/json';

  constructor(private http: HttpClient) {
  }

  public searchByTopic(topic: string): Observable<SPARQLResource[]> {
    const body = this.constructRequestBody(topic);
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: this.acceptHeader,
        'Content-Type': this.contentTypeHeader
      })
    };

    return this.http.post(this.endpoint, body, httpOptions)
      .pipe(map((apiResponse: APIResponse) => {
        return apiResponse.results.bindings.map(binding => new SPARQLResource(binding.url.value));
      }));
  }

  private constructRequestBody(topic: string): string {
    const body = {
      query: this.constructQueryForTopic(topic)
    };

    return JSON.stringify(body);
  }

  private constructQueryForTopic(topic: string, pageSize: number = 10, offset: number = 0): string {
    return `
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
    bindings: Array<{url: {type: string, value: string}}>
  };
}
