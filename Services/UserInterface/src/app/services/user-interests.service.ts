import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserInterestsService {
  constructor(private http: HttpClient) {
  }

  collectUserInterests(oAuthToken?: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ Authorization: `token ${oAuthToken}` })
    };
    return this.http.get(environment.apiEndpoints.userInterests, httpOptions);
  }
}
