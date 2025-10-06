import { Routes } from '@angular/router';
import { SwipeComparisonComponent } from './components/swipe-comparison/swipe-comparison.component';

export const routes: Routes = [
  { path: '', component: SwipeComparisonComponent },
  { path: '**', redirectTo: '' }
];
