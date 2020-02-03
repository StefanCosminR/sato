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
    MatNativeDateModule,
    MatToolbarModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxLinkPreviewModule } from 'ngx-link-preview';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdvancedSearchComponent } from './components/pages/advanced-search/advanced-search.component';
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
        WordPluralizerPipe,
        SearchPageComponent,
        ResourceUrlImagePipe,
        CatalogPageComponent,
        MainMenuBarComponent,
        ReactiveInputComponent,
        ResourcesListComponent,
        AdvancedSearchComponent,
        ResourceNameExtractorPipe,
        SuggestionsLayoutComponent
    ],
    imports: [
        NgbModule,
        FormsModule,
        BrowserModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        AppRoutingModule,
        MatToolbarModule,
        MatFormFieldModule,
        NgxLinkifyjsModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatNativeDateModule,
        MatLinkPreviewModule,
        NgxLinkPreviewModule,
        AngularFireAuthModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        NgMultiSelectDropDownModule.forRoot(),
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
