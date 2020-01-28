import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './components/pages/main-page/main-page.component';
import { MatLinkPreviewModule } from '@angular-material-extensions/link-preview';
import { NgModule } from '@angular/core';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'search', component: SearchPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    NgxLinkifyjsModule.forRoot(),
    MatLinkPreviewModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
