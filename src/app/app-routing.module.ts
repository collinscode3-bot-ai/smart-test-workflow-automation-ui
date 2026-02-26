import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectsDashboardComponent } from './components/projects-dashboard/projects-dashboard.component';
import { TestSuiteDashboardComponent } from './components/test-suite-dashboard/test-suite-dashboard.component';
import { TestSuiteFormComponent } from './components/test-suite-form/test-suite-form.component';
import { TestExecutionHomeComponent } from './components/test-execution-home/test-execution-home.component';
import { TestCaseDetailsComponent } from './components/test-case-details/test-case-details.component';
import { ContractDetailsComponent } from './components/contract-details/contract-details.component';
import { VerificationDetailsComponent } from './components/verification-details/verification-details.component';
import { ModalGuard } from './guards/modal-guard.guard';

const routes: Routes = [
  { path: '', component: ProjectFormComponent },
  { path: 'projects/dashboard', component: ProjectsDashboardComponent },
  { path: 'projects/list', component: ProjectsDashboardComponent },
  { path: 'test-suites/create', component: TestSuiteFormComponent },
  { path: 'test-suites/edit/:id', component: TestSuiteFormComponent, data: { mode: 'edit' } },
  { path: 'test-suites/list', component: TestSuiteDashboardComponent },
  { path: 'test-suites/execution/:id', component: TestExecutionHomeComponent },
  { path: 'test-cases/create', component: TestCaseDetailsComponent },
  { path: 'test-cases/edit/:id', component: TestCaseDetailsComponent, data: { mode: 'edit' } },
  { path: 'contracts/create', component: ContractDetailsComponent },
  { path: 'contracts/edit/:id', component: ContractDetailsComponent, data: { mode: 'edit' } },
  { path: 'projects/:projectId/suites/:suiteId/testcases/:caseId/verifications/new', component: VerificationDetailsComponent, canDeactivate: [ModalGuard] },
  { path: 'projects/:projectId/suites/:suiteId/testcases/:caseId/verifications/edit/:verificationId', component: VerificationDetailsComponent, data: { mode: 'edit' }, canDeactivate: [ModalGuard] },
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
