import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  environment = environment;
  user_types = [
    {
      id: 1,
      title: 'Job Seeker',
    },
    {
      id: 2,
      title: 'Employer',
    },
  ];
  constructor(private http: HttpClient) {}

  http_header() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('access_token') as string,
      }),
    };
  }

  http_header2() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/octet-stream',
        Authorization: localStorage.getItem('access_token') as string,
      }),
    };
  }

  get(data: string) {
    return this.http.get(environment.url + data, this.http_header());
  }

  get_(data: string) {
    return this.http.get(environment.url + data);
  }

  post(data: string, body: any) {
    return this.http.post(environment.url + data, body, this.http_header());
  }

  put(data: string, body: any) {
    return this.http.put(environment.url + data, body, this.http_header());
  }

  upload(data: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('PUT', environment.url + data, formData, {
      // reportProgress: true,
      // responseType: 'json',
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('access_token') as string,
      })
    });
    return this.http.request(req);
  }

  delete(data: string) {
    return this.http.delete(environment.url + data, this.http_header());
  }

  post_(data: string, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(environment.url + data, body, options);
  }

  post__(data: string, body: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(data, body, options);
  }

  get__(data: string) {
    return this.http.get(data);
  }
}
