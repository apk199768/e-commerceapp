import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';


@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent  {
logOut() {
 

    // After signing out, set the user to null or any other initial value.
    this.user = null;
  ;
}
  title!: 'angular=sign';
  user: any;
  loggedIn: any;

  constructor(private authService: SocialAuthService) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }
}
