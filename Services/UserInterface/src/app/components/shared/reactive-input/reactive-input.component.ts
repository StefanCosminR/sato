import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'sato-reactive-input',
  templateUrl: './reactive-input.component.html',
  styleUrls: ['./reactive-input.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReactiveInputComponent implements OnInit {
  @Input() inputValue: BehaviorSubject<string>;

  // tslint:disable-next-line:variable-name
  public _inputValue = '';

  constructor() { }

  ngOnInit() {
    this._inputValue = this.inputValue.getValue();
  }

  submitValue() {
    this.inputValue.next(this._inputValue);
  }
}
