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
import { AuthenticationService } from './services/authentication.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MainMenuBarComponent } from './components/shared/main-menu-bar/main-menu-bar.component';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { MatLinkPreviewModule } from '@angular-material-extensions/link-preview';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLinkPreviewModule } from 'ngx-link-preview';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { ReactiveInputComponent } from './components/shared/reactive-input/reactive-input.component';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
import { UserInterestsService } from './services/user-interests.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainMenuBarComponent,
    SearchPageComponent,
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
    MatProgressSpinnerModule,
    MatCardModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
      AuthenticationService,
      UserInterestsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
