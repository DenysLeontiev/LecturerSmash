import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institute, Department, Worker } from '../models/institute.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7006/api'; // Update with your API URL

  getInstitutes(): Observable<Institute[]> {
    return this.http.get<Institute[]>(`${this.baseUrl}/institutes`);
  }

  getDepartments(instituteId: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments/${instituteId}`);
  }

  getTwoRandomWorkers(departmentId: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.baseUrl}/two-random-workers/${departmentId}`);
  }

  recordChoice(winnerId: string, loserId: string): Observable<any> {
    // You can implement this endpoint in your backend later
    return this.http.post(`${this.baseUrl}/record-choice`, {
      winnerId,
      loserId
    });
  }
}