import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PresenceService } from '../../services/presence/presence.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule
} from "ng-apexcharts";
import { UsersStatsService } from '../../services/users-stats/users-stats.service';
import { UsersStats } from '../../models/users-stats.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-users-stats',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgApexchartsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './users-stats.html',
  styleUrls: ['./users-stats.scss']
})
export class UsersStatsComponent implements OnInit, OnDestroy {

  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;

  public presenceService = inject(PresenceService);
  private usersStatsService = inject(UsersStatsService);

  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  get start() { return this.range.get('start') as FormControl; }
  get end() { return this.range.get('end') as FormControl; }

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Онлайн користувачів",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Кількість користувачів онлайн за період",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: []
      }
    };

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 6);
    this.range.setValue({ start: lastWeek, end: today });
  }

  async ngOnInit() {
    await this.presenceService.joinAdminGroup();
    this.loadStats();
  }

  async ngOnDestroy() {
    await this.presenceService.leaveAdminGroup();
  }

  onRangeChange() {
    this.loadStats();
  }

  private loadStats() {
    const start = this.start.value;
    const end = this.end.value;

    if (!start || !end) {
      return;
    }

    this.usersStatsService.getStatsByDateRange(start, end).subscribe({
      next: (stats: UsersStats[]) => {
        this.updateChart(stats);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  private updateChart(stats: UsersStats[]) {
    // Sort by date ascending
    const sortedStats = [...stats].sort((a, b) => 
      new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
    );

    const categories = sortedStats.map(stat => 
      new Date(stat.dateCreated).toLocaleDateString('uk-UA', { 
        month: 'short', 
        day: 'numeric' 
      })
    );

    const data = sortedStats.map(stat => stat.numberOfOnlineUsers);

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: "Онлайн користувачів",
          data: data
        }
      ],
      xaxis: {
        categories: categories
      }
    };
  }
}
