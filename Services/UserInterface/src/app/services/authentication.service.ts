import * as firebase from 'firebase/app';

import { Injectable, NgZone } from '@angular/core';
import { from, throwError } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly LOGIN_CREDENTIALS = 'sato.oauth.credentials';

  credentials: firebase.auth.UserCredential;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone) {
    this.credentials = this.getStoredCredentials();
  }

  signUp(email: string, password: string): void {
    from(this.fireAuth.auth.createUserWithEmailAndPassword(email, password))
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      ).subscribe(response => {
        console.log('Successfully signed up!');
      });
  }

  signIn(email: string, password: string): void {
    from(this.fireAuth.auth.signInWithEmailAndPassword(email, password))
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      ).subscribe(response => {
        console.log('Successfully signed in!');
      });
  }

  signOut(): void {
    this.credentials = undefined;
    localStorage.removeItem(this.LOGIN_CREDENTIALS);
    this.fireAuth.auth.signOut();
  }

  githubAuth(): void {
    from(this.fireAuth.auth.signInWithPopup(this.getGithubAuthProvider()))
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      ).subscribe(credentials => {
        this.credentials = credentials;
        localStorage.setItem(this.LOGIN_CREDENTIALS, JSON.stringify(credentials));
        this.ngZone.run(() => this.router.navigate(['']));
      });
  }

  private getGithubAuthProvider(): firebase.auth.AuthProvider {
    return new firebase.auth.GithubAuthProvider().addScope('repo');
  }

  private getStoredCredentials(): firebase.auth.UserCredential | undefined {
    const credentials = localStorage.getItem(this.LOGIN_CREDENTIALS);
    if (!!credentials) {
        return JSON.parse(credentials);
    }
    return undefined;
  }
}
