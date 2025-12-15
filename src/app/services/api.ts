import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  kpis: {
    totalUsers: number;
    revenue: number;
    tasksPending: number;
    activeSessions: number;
  };
  charts: {
    monthlyStats: { labels: string[], data: number[] };
    userDistribution: { labels: string[], data: number[] };
    trendGraph: { labels: string[], data: number[] };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>('/api/dashboard');
  }
}
