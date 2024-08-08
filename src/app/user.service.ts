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

  checkOrGenerateUser(metadata: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/Users/checkAndSetUserInfo`, metadata);
  }
}
