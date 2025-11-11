import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { User } from '../../common/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrlUser = `${environment.Endpoint}/user`;
  private baseUrlMfa = `${environment.Endpoint}/mfa`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private storage: StorageService) {
    const userJson = this.storage?.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(userJson ? JSON.parse(userJson) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // 🧾 Register user
  register(payload: {name:string, email: string, password: string}): Observable<any> {
    const {name, email, password} = payload;
    return this.http.post(`${this.baseUrlUser}/register`, { name, email, password });
  }

  setUser(user: User): void {
    const _user = this.storage?.getObject<User>('currentUser') || {} as User;
    this.storage?.setObject('currentUser', {..._user, ...user });
  }

  getUser(): User | null {
    return this.storage?.getObject<User>('currentUser');
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
        if (response?.user) {
          this.setUser(response.user as User);
        }
        return response;
      })
    );
  }

  // 🧾 Generate MFA (Step 2: get QR code)
  generateMfa(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrlMfa}/generate-mfa/${userId}`);
  }

  verifyMfaSetup(userId: string, token: string) {
    return this.http.post<any>(`${this.baseUrlMfa}/verify-mfa-setup`, { userId, token });
  }

  // ✅ Verify MFA (Step 3)
  verifyMfa(userId: string, token: string): Observable<any> {
    return this.http.post(`${this.baseUrlMfa}/verify-mfa`, { userId, token }).pipe(
      map((response: any) => {
        if (response?.token) {
          // Store final JWT for the session
          this.storage?.setItem('authToken', response.token);
          this.setUser(response.user);
          const user = JSON.parse(JSON.stringify(response.user || '{}'));
          this.currentUserSubject.next(response.user);
        }
        return response;
      })
    );
  }

  //  Check login status
  get isLoggedIn(): boolean {
    return !!this.storage?.getItem('authToken');
  }

  isTokenExpired(): boolean {
    const token = this.storage?.getItem('authToken');
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }

  //  Logout
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrlUser}/logout`, {})
      .pipe(
        tap(() => {
          this.clearStorage();
        })
      );
  }

  clearStorage(): void {
    this.storage?.clear();
    this.currentUserSubject.next(null);
  }

}
