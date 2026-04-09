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
import { ValidationConfigurationComponent } from './components/validation-configuration/validation-configuration.component';
import { TestDataManagementComponent } from './components/test-data-management/test-data-management.component';
import { TestCaseConfigurationComponent } from './components/test-case-configuration/test-case-configuration.component';
import { ContractManagementComponent } from './components/contract-management/contract-management.component';
import { VerificationManagementComponent } from './components/verification-management/verification-management.component';
import { ModalGuard } from './guards/modal-guard.guard';
import { WorkflowResolver } from './services/workflow.resolver';

const routes: Routes = [
  { path: '', component: ProjectFormComponent },
  { path: 'projects/dashboard', component: ProjectsDashboardComponent, resolve: { workflow: WorkflowResolver } },
  { path: 'projects/list', component: ProjectsDashboardComponent, resolve: { workflow: WorkflowResolver } },
  { path: 'projects/create', component: ProjectFormComponent },
  { path: 'projects/edit/:projectId', component: ProjectFormComponent, data: { mode: 'edit' }, resolve: { workflow: WorkflowResolver } },

  // Hierarchical structure
  {
    path: 'projects/:projectId',
    resolve: { workflow: WorkflowResolver },
    runGuardsAndResolvers: 'always', // Force re-run for children
    children: [
      { path: 'suites/list', component: TestSuiteDashboardComponent },
      { path: 'suites/create', component: TestSuiteFormComponent },
      { path: 'suites/edit/:suiteId', component: TestSuiteFormComponent, data: { mode: 'edit' } },
      { path: 'suites/execution/:suiteId', component: TestExecutionHomeComponent },

      {
        path: 'suites/:suiteId',
        runGuardsAndResolvers: 'always',
        children: [
          { path: 'test-cases/list', component: TestCaseConfigurationComponent },
          { path: 'test-cases/create', component: TestCaseConfigurationComponent },
          { path: 'test-cases/edit/:testCaseId', component: TestCaseConfigurationComponent, data: { mode: 'edit' } },
          { path: 'test-cases/details/create', component: TestCaseDetailsComponent },
          { path: 'test-cases/details/edit/:testCaseId', component: TestCaseDetailsComponent, data: { mode: 'edit' } },
          { path: 'test-cases/:testCaseId/contracts/manage', component: ContractManagementComponent },
          { path: 'test-cases/:testCaseId/test-data/datasets', component: TestDataManagementComponent },

          {
            path: 'test-cases/:testCaseId/verifications',
            runGuardsAndResolvers: 'always',
            children: [
              { path: 'manage', component: VerificationManagementComponent },
              { path: 'new', component: VerificationDetailsComponent, canDeactivate: [ModalGuard] },
              { path: 'edit/:verificationId', component: VerificationDetailsComponent, data: { mode: 'edit' }, canDeactivate: [ModalGuard] },

              {
                path: ':verificationId/validations',
                runGuardsAndResolvers: 'always',
                children: [
                  { path: 'new', component: ValidationConfigurationComponent },
                  { path: 'edit/:validationId', component: ValidationConfigurationComponent, data: { mode: 'edit' } }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // Fallback for old links or specific needs
  { path: 'test-suites/list', component: TestSuiteDashboardComponent, resolve: { workflow: WorkflowResolver } },
  { path: 'test-case-config', component: TestCaseConfigurationComponent },
  { path: 'contracts/manage', component: ContractManagementComponent },
  { path: 'test-data/datasets', component: TestDataManagementComponent },
  { path: 'test-execution/runs', component: ProjectFormComponent },
  { path: 'test-execution/reports', component: ProjectFormComponent },
  { path: 'edit', component: ProjectFormComponent, data: { mode: 'edit' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
