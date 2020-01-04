import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'sato-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(public authService: AuthenticationService) { }

  ngOnInit() {
  }
}
