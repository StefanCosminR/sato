import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../shared/authentication.service';

@Component({
  selector: 'sato-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }
}
