import * as firebase from 'firebase/app';

import { Observable, from, throwError } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  user: Observable<firebase.User>;

  constructor(private fireAuth: AngularFireAuth) {
    this.user = fireAuth.authState;
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
      ).subscribe(console.log);
  }
}
