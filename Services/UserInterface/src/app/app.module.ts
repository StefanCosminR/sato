import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import {FormsModule} from '@angular/forms';
import { MainMenuBarComponent } from './components/shared/main-menu-bar/main-menu-bar.component';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
import {MatLinkPreviewModule} from '@angular-material-extensions/link-preview';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxLinkifyjsModule} from 'ngx-linkifyjs';
import {NgxLinkPreviewModule} from 'ngx-link-preview';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainMenuBarComponent,
    SearchPageComponent
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
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
