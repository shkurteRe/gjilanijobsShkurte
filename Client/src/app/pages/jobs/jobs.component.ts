import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  form: any;
  jobs: any;
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: UntypedFormBuilder,
    public _location: Location,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [''],
      zip_code: [''],
    });
    
    let title = this.activatedRoute.snapshot.queryParams["title"] ? this.activatedRoute.snapshot.queryParams["title"] : "";
    let zip_code = this.activatedRoute.snapshot.queryParams["zip_code"] ? this.activatedRoute.snapshot.queryParams["zip_code"] : "";

    this.search(title, zip_code);
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.search(this.form.value.title,this.form.value.zip_code);
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  search(title : any, zip_code : any) {
    this.loading = true;
    this.api
      .get_(
        `auth/search/?title=${title}&zip_code=${zip_code}`
      )
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.jobs = response;
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

  backClicked() {
    this._location.back();
  }
}