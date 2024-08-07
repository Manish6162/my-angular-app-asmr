import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7290/api/Users/checkOrGenerateUser';

  constructor(private http: HttpClient) {}

  checkAndGenerateUser(metadata: { deviceId: string; userAgent: string; browserInfo: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, metadata);
  }
}
