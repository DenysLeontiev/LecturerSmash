import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UsersStats } from '../../models/users-stats.model';

@Injectable({
  providedIn: 'root'
})
export class UsersStatsService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getStatsByDateRange(dateStart: Date, dateEnd: Date): Observable<UsersStats[]> {
    const startDate = new Date(dateStart);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(dateEnd);
    endDate.setHours(23, 59, 59, 999);
    
    const params = {
      dateStart: startDate.toISOString(),
      dateEnd: endDate.toISOString()
    };
    return this.http.get<UsersStats[]>(`${this.baseUrl}/stats/days`, { params });
  }
}
