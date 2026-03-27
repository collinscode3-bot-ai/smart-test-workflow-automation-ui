import { Component, OnInit } from '@angular/core';
import { WorkflowStateService, LevelContext } from '../../services/workflow-state.service';
import { combineLatest } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
  active: boolean;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private workflowService: WorkflowStateService) {}

  ngOnInit(): void {
    combineLatest([
      this.workflowService.currentProject$,
      this.workflowService.currentSuite$,
      this.workflowService.currentTestCase$,
      this.workflowService.currentVerification$,
      this.workflowService.currentValidation$
    ]).subscribe(([proj, suite, testCase, verify, valid]) => {
      this.updateBreadcrumbs(proj, suite, testCase, verify, valid);
    });
  }

  private updateBreadcrumbs(
    proj: LevelContext,
    suite: LevelContext,
    testCase: LevelContext,
    verify: LevelContext,
    valid: LevelContext
  ): void {
    const crumbs: Breadcrumb[] = [
      { label: 'Home', url: '/', active: false }
    ];

    if (proj.id) {
      crumbs.push({
        label: proj.name || `Project ${proj.id}`,
        url: '/projects/dashboard',
        active: !suite.id
      });
    }

    if (suite.id) {
      crumbs.push({
        label: suite.name || `Suite ${suite.id}`,
        url: `/projects/${proj.id}/suites/list`,
        active: !testCase.id
      });
    }

    if (testCase.id) {
      crumbs.push({
        label: testCase.name || `Test Case ${testCase.id}`,
        url: `/projects/${proj.id}/suites/${suite.id}/test-cases/edit/${testCase.id}`,
        active: !verify.id
      });
    }

    if (verify.id) {
      crumbs.push({
        label: verify.name || `Verification ${verify.id}`,
        url: `/projects/${proj.id}/suites/${suite.id}/test-cases/${testCase.id}/verifications/manage`,
        active: !valid.id
      });
    }

    if (valid.id) {
      crumbs.push({
        label: valid.name || `Validation ${valid.id}`,
        url: '',
        active: true
      });
    }

    this.breadcrumbs = crumbs;
  }
}
