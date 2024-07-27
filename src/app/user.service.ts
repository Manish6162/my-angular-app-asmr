import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  checkAndGenerateUser(metadata: { ip: string; userAgent: string; location: string; browserInfo: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users/checkOrGenerateUser`, metadata);
  }
}
