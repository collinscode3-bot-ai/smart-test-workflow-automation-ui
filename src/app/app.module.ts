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
    TestExecutionHomeComponent
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
