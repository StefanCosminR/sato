import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {Link, NgxLinkifyjsService} from 'ngx-linkifyjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'sato-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private queryParamsSubscription: Subscription;
  public searchContent: string;
  public trackingLinks: Array<Link>;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(param => {
      this.searchContent = param.query;
    });

    // this.trackingLinks = this.linkifyService.find(
    //   'https://software.rajivprab.com/2019/12/29/bayes-vs-frequentists-an-empirical-test-in-code');
    // console.log('tracking link', this.trackingLinks);
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

  public apiCallbackFn = (route: string) => {
    return this.http.get(route);
  }

}
