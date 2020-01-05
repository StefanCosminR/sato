import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GithubService {

  constructor(private http: HttpClient) {
  }

  collectRepositories(oAuthToken?: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/vnd.github.mercy-preview+json',
        'Authorization': `token ${oAuthToken}`
      })
    };
    return this.http.get(`https://api.github.com/user/repos?per_page=30&page=2`, httpOptions);
  }
}
