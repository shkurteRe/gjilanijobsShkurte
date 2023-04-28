import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.css']
})
export class Header2Component implements OnInit {
  lang : any;
  constructor(
    public auth: AuthService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.lang = localStorage.getItem("job-portal-lang") ? localStorage.getItem("job-portal-lang") : 'en';
  }

  selectLang(e: any) {
    localStorage.setItem("job-portal-lang", e.target.value);
    this.translate.use(e.target.value);
  }

}
