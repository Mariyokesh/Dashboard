import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, DashboardData } from '../../services/api';
import { AuthService } from '../../services/auth';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  data: DashboardData | null = null;
  loading = true;
  isAdmin = false;

  // Charts
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  lineChartType: ChartType = 'line';
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserRoleFromApi().subscribe(role => {
      this.isAdmin = role === 'Admin';
    });
    
    this.apiService.getDashboardData().subscribe(data => {
      this.data = data;
      this.setupCharts(data);
      this.loading = false;
    });
  }

  setupCharts(data: DashboardData) {
    // Bar Chart
    this.barChartData = {
      labels: data.charts.monthlyStats.labels,
      datasets: [
        { data: data.charts.monthlyStats.data, label: 'Revenue' }
      ]
    };

    // Pie Chart
    this.pieChartData = {
      labels: data.charts.userDistribution.labels,
      datasets: [
        { data: data.charts.userDistribution.data }
      ]
    };

    // Line Chart
    this.lineChartData = {
      labels: data.charts.trendGraph.labels,
      datasets: [
        { data: data.charts.trendGraph.data, label: 'Tasks' }
      ]
    };
  }

  logout() {
    this.authService.logout();
  }
}
