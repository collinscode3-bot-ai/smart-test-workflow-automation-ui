import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LevelContext {
  id: string | null;
  name: string | null;
}

export interface WorkflowContext {
  projectId: string | null;
  projectName: string | null;
  suiteId: string | null;
  suiteName: string | null;
  testCaseId: string | null;
  testCaseName: string | null;
  verificationId: string | null;
  verificationName: string | null;
  validationId: string | null;
  validationName: string | null;
}

const SESSION_KEY = 'workflow_state';

@Injectable({
  providedIn: 'root'
})
export class WorkflowStateService {
  private projectSubject = new BehaviorSubject<LevelContext>({ id: null, name: null });
  private suiteSubject = new BehaviorSubject<LevelContext>({ id: null, name: null });
  private testCaseSubject = new BehaviorSubject<LevelContext>({ id: null, name: null });
  private verificationSubject = new BehaviorSubject<LevelContext>({ id: null, name: null });
  private validationSubject = new BehaviorSubject<LevelContext>({ id: null, name: null });

  public currentProject$: Observable<LevelContext> = this.projectSubject.asObservable();
  public currentSuite$: Observable<LevelContext> = this.suiteSubject.asObservable();
  public currentTestCase$: Observable<LevelContext> = this.testCaseSubject.asObservable();
  public currentVerification$: Observable<LevelContext> = this.verificationSubject.asObservable();
  public currentValidation$: Observable<LevelContext> = this.validationSubject.asObservable();

  constructor() {
    this.loadFromSession();
  }

  private loadFromSession(): void {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const state: WorkflowContext = JSON.parse(saved);
        this.projectSubject.next({ id: state.projectId, name: state.projectName });
        this.suiteSubject.next({ id: state.suiteId, name: state.suiteName });
        this.testCaseSubject.next({ id: state.testCaseId, name: state.testCaseName });
        this.verificationSubject.next({ id: state.verificationId, name: state.verificationName });
        this.validationSubject.next({ id: state.validationId, name: state.validationName });
      }
    } catch (e) {
      console.error('Error loading workflow state from session', e);
    }
  }

  private saveToSession(): void {
    const state: WorkflowContext = {
      projectId: this.projectSubject.value.id,
      projectName: this.projectSubject.value.name,
      suiteId: this.suiteSubject.value.id,
      suiteName: this.suiteSubject.value.name,
      testCaseId: this.testCaseSubject.value.id,
      testCaseName: this.testCaseSubject.value.name,
      verificationId: this.verificationSubject.value.id,
      verificationName: this.verificationSubject.value.name,
      validationId: this.validationSubject.value.id,
      validationName: this.validationSubject.value.name
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }

  setProject(id: string | null, name: string | null): void {
    if (this.projectSubject.value.id !== id) {
      this.projectSubject.next({ id, name });
      this._resetSuite();
      this.saveToSession();
    } else if (this.projectSubject.value.name !== name) {
      this.projectSubject.next({ id, name });
      this.saveToSession();
    }
  }

  setSuite(id: string | null, name: string | null): void {
    if (this.suiteSubject.value.id !== id) {
      this.suiteSubject.next({ id, name });
      this._resetTestCase();
      this.saveToSession();
    } else if (this.suiteSubject.value.name !== name) {
      this.suiteSubject.next({ id, name });
      this.saveToSession();
    }
  }

  setTestCase(id: string | null, name: string | null): void {
    if (this.testCaseSubject.value.id !== id) {
      this.testCaseSubject.next({ id, name });
      this._resetVerification();
      this.saveToSession();
    } else if (this.testCaseSubject.value.name !== name) {
      this.testCaseSubject.next({ id, name });
      this.saveToSession();
    }
  }

  setVerification(id: string | null, name: string | null): void {
    if (this.verificationSubject.value.id !== id) {
      this.verificationSubject.next({ id, name });
      this._resetValidation();
      this.saveToSession();
    } else if (this.verificationSubject.value.name !== name) {
      this.verificationSubject.next({ id, name });
      this.saveToSession();
    }
  }

  setValidation(id: string | null, name: string | null): void {
    if (this.validationSubject.value.id !== id || this.validationSubject.value.name !== name) {
      this.validationSubject.next({ id, name });
      this.saveToSession();
    }
  }

  private _resetSuite(): void {
    this.suiteSubject.next({ id: null, name: null });
    this._resetTestCase();
  }

  private _resetTestCase(): void {
    this.testCaseSubject.next({ id: null, name: null });
    this._resetVerification();
  }

  private _resetVerification(): void {
    this.verificationSubject.next({ id: null, name: null });
    this._resetValidation();
  }

  private _resetValidation(): void {
    this.validationSubject.next({ id: null, name: null });
  }

  getSnapshot(): WorkflowContext {
    return {
      projectId: this.projectSubject.value.id,
      projectName: this.projectSubject.value.name,
      suiteId: this.suiteSubject.value.id,
      suiteName: this.suiteSubject.value.name,
      testCaseId: this.testCaseSubject.value.id,
      testCaseName: this.testCaseSubject.value.name,
      verificationId: this.verificationSubject.value.id,
      verificationName: this.verificationSubject.value.name,
      validationId: this.validationSubject.value.id,
      validationName: this.validationSubject.value.name
    };
  }

  clearAll(): void {
    this.projectSubject.next({ id: null, name: null });
    this._resetSuite();
    sessionStorage.removeItem(SESSION_KEY);
  }
}
