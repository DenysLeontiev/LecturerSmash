import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Institute } from '../models/institute.model';
import { environment } from '../../environments/environment.development';
import { Department } from '../models/department.model';
import { Worker } from '../models/worker.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getInstitutes(): Observable<Institute[]> {
    return this.http.get<Institute[]>(`${this.baseUrl}/institutes`);
  }

  getDepartments(instituteId: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/departments/${instituteId}`);
  }

  getTwoRandomWorkers(departmentId: string): Observable<Worker[]> {
    return this.http.get<Worker[]>(`${this.baseUrl}/two-random-workers/${departmentId}`);
  }

  likeWorker(workerId: string): Observable<Worker> {
    return this.http.post<Worker>(`${this.baseUrl}/worker/${workerId}/like`, {});
  }

  dislikeWorker(workerId: string): Observable<Worker> {
    return this.http.post<Worker>(`${this.baseUrl}/worker/${workerId}/dislike`, {});
  }
}