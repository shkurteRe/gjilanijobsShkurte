import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any;
  _2form: any;
  loading: boolean | undefined;
  phone: string | undefined;
  action = 1;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required]],
    });

    this._2form = this.formBuilder.group({
      token: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (this.action == 1) {
        this.login();
      } else {
        this._2factor();
      }
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  login() {
    this.loading = true;
    this.api.post_('auth/users', this.form.value).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.is_2factor_auth_enabled) {
          this.action = 2;
        } else {
          this.auth.setLogin(response);
          this.navigate();
        }
      },
      (error) => {
        this.loading = false;
        this.fun.presentAlertError(
          error.error.message ||
            error.error.sqlMessage ||
            'Something went wrong. Try again.'
        );
      }
    );
  }

  _2factor() {
    this.loading = true;
    this.api
      .post_('auth/verify/users', {
        email: this.form.value.email,
        token: this._2form.value.token,
      })
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.auth.setLogin(response);
          this.navigate();
        },
        (error) => {
          this.loading = false;
          this.fun.presentAlertError(
            error.error.message ||
              error.error.sqlMessage ||
              'Something went wrong. Try again.'
          );
        }
      );
  }

  signInWithGoogle() {
    window.open(
      `${environment.url}login/google`,
      'mywindow',
      'location=1,status=1,scrollbars=1, width=800,height=800'
    );
    let listener = window.addEventListener('message', (response) => {
      this.loading = false;
      this.auth.setLogin(response.data);
      this.navigate();
    });
  }

  navigate() {
    if (this.auth.user.user_type) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/info');
    }
  }
}
