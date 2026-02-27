import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppPleaseWaitComponent } from './components/app-please-wait/app-please-wait.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProjectsDashboardComponent } from './components/projects-dashboard/projects-dashboard.component';
import { TestSuiteDashboardComponent } from './components/test-suite-dashboard/test-suite-dashboard.component';
import { TestSuiteFormComponent } from './components/test-suite-form/test-suite-form.component';
import { TestExecutionHomeComponent } from './components/test-execution-home/test-execution-home.component';
import { TestCaseResultsModalComponent } from './components/test-case-results-modal/test-case-results-modal.component';
import { TestCaseDetailsComponent } from './components/test-case-details/test-case-details.component';
import { ContractDetailsComponent } from './components/contract-details/contract-details.component';
import { VerificationDetailsComponent } from './components/verification-details/verification-details.component';
import { VerificationParameterModalComponent } from './components/verification-parameter-modal/verification-parameter-modal.component';
import { ValidationConfigurationComponent } from './components/validation-configuration/validation-configuration.component';
import { FieldPropertiesModalComponent } from './components/field-properties-modal/field-properties-modal.component';
import { ValidationParameterModalComponent } from './components/validation-parameter-modal/validation-parameter-modal.component';
import { ErrorMessageModalComponent } from './components/error-message-modal/error-message-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AppPleaseWaitComponent,
    BreadcrumbsComponent,
    ProjectFormComponent,
    HeaderComponent,
    SidebarComponent,
    ProjectsDashboardComponent,
    TestSuiteDashboardComponent,
    TestSuiteFormComponent,
    TestExecutionHomeComponent,
    TestCaseResultsModalComponent,
    TestCaseDetailsComponent,
    ContractDetailsComponent,
    VerificationDetailsComponent,
    VerificationParameterModalComponent,
    ValidationConfigurationComponent,
    FieldPropertiesModalComponent,
    ValidationParameterModalComponent,
    ErrorMessageModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
