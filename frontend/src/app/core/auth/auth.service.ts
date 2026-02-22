import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

type AuthUser = {
  id: number;
  email: string;
  roles: string[];
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'meditracker-token';
  private readonly userKey = 'meditracker-user';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.loadStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password }).pipe(
      tap((response) => this.setSession(response.token, response.user)),
      map((response) => response.user)
    );
  }

  login(email: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => this.setSession(response.token, response.user)),
      map((response) => response.user)
    );
  }

  me(): Observable<AuthUser> {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<AuthUser>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((user) => this.userSubject.next(user))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setSession(token: string, user: AuthUser): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private loadStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
