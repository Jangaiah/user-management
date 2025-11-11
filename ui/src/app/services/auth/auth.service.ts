import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrlUser = `${environment.Endpoint}/user`;
  private baseUrlMfa = `${environment.Endpoint}/mfa`;
  private storage?: Storage;

  constructor(private http: HttpClient, private storageService: StorageService) {
    this.storage = this.storageService.getStorageType();
  }

  // 🧾 Register user
  register(payload: {name:string, email: string, password: string}): Observable<any> {
    const {name, email, password} = payload;
    return this.http.post(`${this.baseUrlUser}/register`, { name, email, password });
  }

  setUserId(userId: string): void {
    this.storage?.setItem('userId', userId);
  }
  getUserId(): string | null | undefined {
    return this.storage?.getItem('userId');
  }

  // 🔑 Login (Step 1: password)
  login(payload: {email: string, password: string}): Observable<any> {
    const {email, password} = payload;
    return this.http.post(`${this.baseUrlUser}/login`, { email, password }).pipe(
      map((response: any) => {
        if (response?.token) {
          // temporary token before MFA
          this.storage?.setItem('tempToken', response.token);
        }
        if (response?.userId) {
          this.storage?.setItem('userId', response.userId);
        }
        return response;
      })
    );
  }

  // 🧾 Generate MFA (Step 2: get QR code)
  generateMfa(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrlMfa}/generate-mfa/${userId}`);
  }

  // ✅ Verify MFA (Step 3)
  verifyMfa(userId: string, token: string): Observable<any> {
    return this.http.post(`${this.baseUrlMfa}/verify-mfa`, { userId, token }).pipe(
      map((response: any) => {
        if (response?.token) {
          // Store final JWT for the session
          this.storage?.setItem('authToken', response.token);
          this.storage?.setItem('currentUser', JSON.stringify(response.user));
        }
        return response;
      })
    );
  }

  // 🔐 Check login status
  get isLoggedIn(): boolean {
    return !!this.storage?.getItem('authToken');
  }

  // 🧹 Logout
  logout(): void {
    this.storage?.removeItem('authToken');
    this.storage?.removeItem('tempToken');
    this.storage?.removeItem('userId');
    this.storage?.removeItem('currentUser');
  }

}
