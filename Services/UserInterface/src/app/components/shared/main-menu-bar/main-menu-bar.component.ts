import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sato-main-menu-bar',
  templateUrl: './main-menu-bar.component.html',
  styleUrls: ['./main-menu-bar.component.scss']
})
export class MainMenuBarComponent implements OnInit {
  @Input() showSearch: boolean;
  @Input() searchInputValue = '';

  constructor() { }

  ngOnInit() {
  }

}
