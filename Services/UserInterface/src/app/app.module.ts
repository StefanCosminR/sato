import { MatLinkPreviewModule } from '@angular-material-extensions/link-preview';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLinkPreviewModule } from 'ngx-link-preview';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogPageComponent } from './components/pages/catalog-page/catalog-page.component';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { ResourcesListComponent } from './components/pages/resources-list/resources-list.component';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
import { MainMenuBarComponent } from './components/shared/main-menu-bar/main-menu-bar.component';
import { ReactiveInputComponent } from './components/shared/reactive-input/reactive-input.component';
import { SuggestionsLayoutComponent } from './components/shared/suggestions-layout/suggestions-layout.component';
import { ResourceNameExtractorPipe } from './pipes/resource-name-extractor.pipe';
import { ResourceUrlImagePipe } from './pipes/resource-url-image.pipe';
import { WordPluralizerPipe } from './pipes/word-pluralizer.pipe';
import { AuthenticationService } from './services/authentication.service';
import { UserInterestsService } from './services/user-interests.service';

@NgModule({
    declarations: [
        AppComponent,
        MainPageComponent,
        CatalogPageComponent,
        MainMenuBarComponent,
        SearchPageComponent,
        ResourceUrlImagePipe,
        WordPluralizerPipe,
        ReactiveInputComponent,
        ResourceNameExtractorPipe,
        SuggestionsLayoutComponent,
        CatalogPageComponent,
        ResourcesListComponent
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
export class AppModule {
}
