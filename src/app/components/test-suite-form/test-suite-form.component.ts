import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { ErrorMessageService } from '../../services/error-message.service';

@Component({
  selector: 'app-test-suite-form',
  templateUrl: './test-suite-form.component.html',
  styleUrls: ['./test-suite-form.component.scss']
})
export class TestSuiteFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  testSuiteForm: FormGroup;
  testCases: any[] = [];
  testSuiteId: string | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private errorMessageService: ErrorMessageService
  ) {
    this.testSuiteForm = this.fb.group({
      suiteName: ['', Validators.required],
      suiteDescription: ['', Validators.required],
      suiteType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.headerService.setHeaderData(
      'Test Suite Details',
      'Define and configure your automated test suite parameters.'
    );

    // Detect mode from route data
    this.route.data.subscribe(data => {
      if (data['mode']) {
        this.mode = data['mode'];
      }
    });

    // Detect ID from route params for edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.testSuiteId = params['id'];
        this.loadTestSuite(this.testSuiteId!);
      }
    });
  }

  loadTestSuite(id: string): void {
    console.log('Loading test suite:', id);
    // API CALL: GET /api/test-suites/{id} (for Edit mode).

    // Mock data for demonstration
    const mockTestSuite = {
      suiteName: 'Login Flow E2E',
      suiteDescription: 'Comprehensive end-to-end testing of the user authentication and authorization process.',
      suiteType: 'E2E Testing'
    };

    if (id === '1') {
        this.testSuiteForm.patchValue(mockTestSuite);
    }
  }

  getError(field: string, type: string): string {
    return this.errorMessageService.getErrorMessage('SUITE', field, type);
  }

  onSubmit(): void {
    if (this.testSuiteForm.valid) {
      if (this.mode === 'create') {
        this.createTestSuite();
      } else {
        this.updateTestSuite();
      }
    } else {
      // Mark all as dirty to show errors if someone tries to submit an empty form
      Object.keys(this.testSuiteForm.controls).forEach(key => {
        this.testSuiteForm.get(key)?.markAsDirty();
      });
    }
  }

  createTestSuite(): void {
    console.log('Creating test suite:', this.testSuiteForm.value);

    // SUCCESS: Set successMessage
    this.successMessage = 'Test Suite created successfully!';
    this.errorMessage = null;

    // AUTO-HIDE and navigate
    setTimeout(() => {
      this.successMessage = null;
      this.router.navigate(['/test-suites/list']);
    }, 5000);
  }

  updateTestSuite(): void {
    console.log('Updating test suite:', this.testSuiteId, this.testSuiteForm.value);

    // SUCCESS: Set successMessage
    this.successMessage = 'Test Suite updated successfully!';
    this.errorMessage = null;

    // AUTO-HIDE and navigate
    setTimeout(() => {
      this.successMessage = null;
      this.router.navigate(['/test-suites/list']);
    }, 5000);
  }

  onCancel(): void {
    this.router.navigate(['/test-suites/list']);
  }
}
