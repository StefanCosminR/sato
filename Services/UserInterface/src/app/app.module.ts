import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MainPageComponent } from './components/pages/main-page/main-page.component';
import {FormsModule} from '@angular/forms';
import { MainMenuBarComponent } from './components/shared/main-menu-bar/main-menu-bar.component';
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from '@angular/material';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';

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
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
