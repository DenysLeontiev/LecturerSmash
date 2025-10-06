import { Component, signal } from '@angular/core';
import { SelectionFormComponent } from './components/selection-form/selection-form.component';
import { SwipeComparisonComponent } from './components/swipe-comparison/swipe-comparison.component';

@Component({
  selector: 'app-root',
  imports: [SelectionFormComponent, SwipeComparisonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TeachersRating.Client');
  selectedDepartmentId = signal<string>('');

  onDepartmentSelected(departmentId: string) {
    this.selectedDepartmentId.set(departmentId);
  }

  backToSelection() {
    this.selectedDepartmentId.set('');
  }
}
