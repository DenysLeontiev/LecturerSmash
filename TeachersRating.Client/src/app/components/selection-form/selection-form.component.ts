import { Component, OnInit, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Institute, Department } from '../../models/institute.model';

@Component({
  selector: 'app-selection-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selection-form.component.html',
  styleUrl: './selection-form.component.scss'
})
export class SelectionFormComponent implements OnInit {
  private apiService = inject(ApiService);

  institutes = signal<Institute[]>([]);
  departments = signal<Department[]>([]);
  selectedInstituteId = signal<string>('');
  selectedDepartmentId = signal<string>('');
  isLoading = signal(false);
  error = signal<string>('');

  // Output event when department is selected
  departmentSelected = output<string>();

  ngOnInit() {
    this.loadInstitutes();
  }

  private loadInstitutes() {
    this.isLoading.set(true);
    this.error.set('');

    this.apiService.getInstitutes().subscribe({
      next: (institutes) => {
        this.institutes.set(institutes);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load institutes. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading institutes:', error);
      }
    });
  }

  onInstituteChange(instituteId: string) {
    this.selectedInstituteId.set(instituteId);
    this.selectedDepartmentId.set('');
    this.departments.set([]);

    if (instituteId) {
      this.loadDepartments(instituteId);
    }
  }

  private loadDepartments(instituteId: string) {
    this.isLoading.set(true);
    this.error.set('');

    this.apiService.getDepartments(instituteId).subscribe({
      next: (departments) => {
        this.departments.set(departments);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load departments. Please try again.');
        this.isLoading.set(false);
        console.error('Error loading departments:', error);
      }
    });
  }

  onDepartmentChange(departmentId: string) {
    this.selectedDepartmentId.set(departmentId);
  }

  startComparison() {
    const departmentId = this.selectedDepartmentId();
    if (departmentId) {
      this.departmentSelected.emit(departmentId);
    }
  }

  canStartComparison() {
    return this.selectedDepartmentId() && !this.isLoading();
  }
}