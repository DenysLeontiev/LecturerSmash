import { Routes } from '@angular/router';
import { TopWorkers } from './components/top-workers/top-workers';
import { UsersStats } from './components/users-stats/users-stats';

export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', loadComponent: () => import('./components/selection-form/selection-form.component').then(m => m.SelectionFormComponent) },
	{ path: 'top-workers', component: TopWorkers },
	{ path: 'users-stats-secret', component: UsersStats },
	{ path: 'comparison/:departmentId', loadComponent: () => import('./components/swipe-comparison/swipe-comparison.component').then(m => m.SwipeComparisonComponent) },
];
