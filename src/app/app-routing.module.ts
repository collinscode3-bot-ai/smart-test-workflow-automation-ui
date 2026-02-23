import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectsDashboardComponent } from './components/projects-dashboard/projects-dashboard.component';
import { TestSuiteDashboardComponent } from './components/test-suite-dashboard/test-suite-dashboard.component';
import { TestSuiteFormComponent } from './components/test-suite-form/test-suite-form.component';
import { TestExecutionHomeComponent } from './components/test-execution-home/test-execution-home.component';

const routes: Routes = [
  { path: '', component: ProjectFormComponent },
  { path: 'projects/dashboard', component: ProjectsDashboardComponent },
  { path: 'projects/list', component: ProjectsDashboardComponent },
  { path: 'test-suites/create', component: TestSuiteFormComponent },
  { path: 'test-suites/edit/:id', component: TestSuiteFormComponent, data: { mode: 'edit' } },
  { path: 'test-suites/list', component: TestSuiteDashboardComponent },
  { path: 'test-suites/execution/:id', component: TestExecutionHomeComponent },
  { path: 'contracts/list', component: ProjectFormComponent },
  { path: 'contracts/upload', component: ProjectFormComponent },
  { path: 'test-data/datasets', component: ProjectFormComponent },
  { path: 'test-data/variables', component: ProjectFormComponent },
  { path: 'test-execution/runs', component: ProjectFormComponent },
  { path: 'test-execution/reports', component: ProjectFormComponent },
  { path: 'edit', component: ProjectFormComponent, data: { mode: 'edit' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
