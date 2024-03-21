import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-login',
  standalone: true,
  imports: [MatCardModule, GoogleSigninButtonModule],
  templateUrl: './google-login.component.html',
  styleUrl: './google-login.component.css',
})
export class GoogleLoginComponent {
  name!: string;
  socialAuthService = inject(SocialAuthService);

  httpService = inject(HttpService);
  router = inject(Router);

  ngOnInit(): void {
    // this.socialAuthService.authState.subscribe((result) => {
    //   console.log('Result', result);
    //   this.name = result.name;
    // });

    this.socialAuthService.authState.subscribe({
      next: (result) => {
        this.name = result.name;
        this.httpService.googleLogin(result.idToken).subscribe((res) => {
          if (res.token) {
            localStorage.setItem('token', res.token);
            this.router.navigateByUrl('/');
          }
        });
        console.log(result);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
