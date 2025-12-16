import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isAuthenticated());
  isLoggedIn$ = this.loggedIn.asObservable();
  
  private timeoutId: any;
  private readonly SESSION_TIMEOUT = 5 * 60 * 1000;
  
  constructor(private router: Router, private http: HttpClient) {
    if (this.isAuthenticated()) {
      this.startSessionTimer();
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('/api/auth/login', {
      username,
      password,
    }).pipe(
      tap(response => {
        const token = response.accessToken || response.token;
        this.setSession(token, response.role || 'admin');
      })
    );
  }

  private setSession(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    this.loggedIn.next(true);
    this.startSessionTimer();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
    this.stopSessionTimer();
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<any>('/api/auth/forgot-password', { email }).pipe(
      tap(() => true)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserRoleFromApi(): Observable<string> {
    return this.http.get<any>('/api/user/role').pipe(
      map(res => res.role)
    );
  }

  getResourceRoles(): Observable<Record<string, string[]>> {
    return this.http.get<any>('/api/roles');
  }

  private startSessionTimer() {
    this.stopSessionTimer();
    this.timeoutId = setTimeout(() => {
      alert('Session timed out due to inactivity.');
      this.logout();
    }, this.SESSION_TIMEOUT);       
  }

  private stopSessionTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
