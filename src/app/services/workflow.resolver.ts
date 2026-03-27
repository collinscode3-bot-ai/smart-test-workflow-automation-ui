import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { WorkflowStateService } from '../services/workflow-state.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowResolver implements Resolve<boolean> {
  constructor(
    private workflowService: WorkflowStateService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const params = this.getParamsFromSnapshot(state.root);

    const projectId = params['projectId'];
    const suiteId = params['suiteId'];
    const testCaseId = params['testCaseId'];
    const verificationId = params['verificationId'];
    const validationId = params['validationId'];

    // Basic logic for mock names
    const projectName = projectId ? this.getMockProjectName(projectId) : null;
    const suiteName = suiteId ? `Suite ${suiteId}` : null;
    const testCaseName = testCaseId ? `Test Case ${testCaseId}` : null;
    const verificationName = verificationId ? `Verification ${verificationId}` : null;
    const validationName = validationId ? `Validation ${validationId}` : null;

    // Safety checks for deep linking
    if (suiteId && !projectId) {
      this.handleError();
      return of(false);
    }
    if (testCaseId && !suiteId) {
      this.handleError();
      return of(false);
    }

    // Update state based on parameters found in URL
    if (projectId) {
      this.workflowService.setProject(projectId, projectName);
    } else if (state.url.includes('/projects/dashboard') || state.url.includes('/projects/list')) {
      this.workflowService.setProject(null, null);
    }

    if (suiteId) {
      this.workflowService.setSuite(suiteId, suiteName);
    } else if (projectId) {
       this.workflowService.setSuite(null, null);
    }

    if (testCaseId) {
      this.workflowService.setTestCase(testCaseId, testCaseName);
    } else if (suiteId) {
       this.workflowService.setTestCase(null, null);
    }

    if (verificationId) {
      this.workflowService.setVerification(verificationId, verificationName);
    } else if (testCaseId) {
       this.workflowService.setVerification(null, null);
    }

    if (validationId) {
      this.workflowService.setValidation(validationId, validationName);
    } else if (verificationId) {
       this.workflowService.setValidation(null, null);
    }

    return of(true);
  }

  private getParamsFromSnapshot(snapshot: ActivatedRouteSnapshot): { [key: string]: string } {
    let params = { ...this.paramsToObject(snapshot.paramMap) };
    for (const child of snapshot.children) {
      params = { ...params, ...this.getParamsFromSnapshot(child) };
    }
    return params;
  }

  private paramsToObject(paramMap: any): { [key: string]: string } {
    const obj: { [key: string]: string } = {};
    paramMap.keys.forEach((key: string) => {
      obj[key] = paramMap.get(key);
    });
    return obj;
  }

  private handleError(): void {
    this.router.navigate(['/projects/dashboard'], { queryParams: { error: 'missing_parent' } });
  }

  private getMockProjectName(id: string): string {
    const projects: { [key: string]: string } = {
      '1': 'Q3 Brand Audit',
      '2': 'Website Redesign',
      '3': 'App Launch 2024',
      '4': 'API Integration'
    };
    return projects[id] || `Project ${id}`;
  }
}
