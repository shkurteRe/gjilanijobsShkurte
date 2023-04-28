import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  phone: string | undefined;
  url = environment.url;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      phone: ['', [Validators.required]],
      summary: ['', [Validators.required]],
      works: ['', [Validators.required]],
      educations: ['', [Validators.required]],
    });

    if (this.auth.user.name) {
      this.form.get('name').setValue(this.auth.user.name);
    }
    if (this.auth.user.email) {
      this.form.get('email').setValue(this.auth.user.email);
    }
    if (this.auth.user.phone) {
      this.form.get('phone').setValue(this.auth.user.phone);
    }
    if (this.auth.user.summary) {
      this.form.get('summary').setValue(this.auth.user.summary);
    }
    if (this.auth.user.works) {
      this.form.get('works').setValue(this.auth.user.works);
    }
    if (this.auth.user.educations) {
      this.form.get('educations').setValue(this.auth.user.educations);
    }
    this.form.markAsDirty();
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.update();
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  update() {
    this.loading = true;
    this.api.put(`authenticated/users`, this.form.value).subscribe(
      (response: any) => {
        this.loading = false;
        this.auth.user = response.user;
        this.fun.presentAlert('Profile has been updated.');
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

  selectFile(event: any): void {
    this.updatePhoto(event.target.files[0]);
  }

  updatePhoto(file: any) {
    this.loading = true;

    this.api.upload(`authenticated/users/photo`, file).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.body) {
          this.auth.user.photo = response.body.file;
          this.fun.presentAlert('Photo has been updated.');
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
}
