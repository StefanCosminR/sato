import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'sato-link-preview-wrapper',
  templateUrl: './link-preview-wrapper.component.html',
  styleUrls: ['./link-preview-wrapper.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class LinkPreviewWrapperComponent implements OnInit {

    @Input() public link: string;
    @Input() public callbackFn;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

    public apiCallbackFn = (route: string) => {
        return this.http.get(route);
    }
}
