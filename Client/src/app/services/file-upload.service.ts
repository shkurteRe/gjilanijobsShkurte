import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(
    private http: HttpClient,
    private auth : AuthService
    ) { 

    }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('PUT', `${environment.url}auth/users/photo/${this.auth.user.id}`, formData, {
      reportProgress: true,
      responseType: 'json',
    });
    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.url}auth/users/files`);
  }
}