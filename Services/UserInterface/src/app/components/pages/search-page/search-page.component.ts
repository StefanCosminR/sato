import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'sato-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private queryParamsSubscription: Subscription;
  public searchContent: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(param => {
      this.searchContent = param.query;
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

}
