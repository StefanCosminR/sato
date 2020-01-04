import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './components/shared/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { MainMenuBarComponent } from './components/shared/main-menu-bar/main-menu-bar.component';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { MatLinkPreviewModule } from '@angular-material-extensions/link-preview';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLinkPreviewModule } from 'ngx-link-preview';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
import { environment } from '../environments/environment';
import { ReactiveInputComponent } from './components/shared/reactive-input/reactive-input.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainMenuBarComponent,
    SearchPageComponent,
    LoginPageComponent,
    ReactiveInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatLinkPreviewModule,
    NgxLinkifyjsModule,
    NgxLinkPreviewModule,
    MatCardModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
