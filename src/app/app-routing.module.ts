import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectFormComponent } from './components/project-form/project-form.component';

const routes: Routes = [
  { path: '', component: ProjectFormComponent },
  { path: 'projects/list', component: ProjectFormComponent },
  { path: 'test-suites/create', component: ProjectFormComponent },
  { path: 'test-suites/list', component: ProjectFormComponent },
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
