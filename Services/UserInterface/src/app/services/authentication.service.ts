import * as firebase from 'firebase/app';

import { Injectable, NgZone } from '@angular/core';
import { from, throwError } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  credentials: firebase.auth.UserCredential;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              private ngZone: NgZone) {
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
    this.fireAuth.auth.signOut();
  }

  githubAuth(): void {
    from(this.fireAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider()))
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      ).subscribe(credentials => {
        this.credentials = credentials;
        this.ngZone.run(() => this.router.navigate(['']));
      });
  }
}
