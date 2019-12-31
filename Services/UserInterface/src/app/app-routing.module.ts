import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './components/pages/main-page/main-page.component';
import {SearchPageComponent} from './components/pages/search-page/search-page.component';


const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'search', component: SearchPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
