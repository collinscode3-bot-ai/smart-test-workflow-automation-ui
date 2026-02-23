import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.testSuiteForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
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
      name: 'Login Flow E2E',
      description: 'Comprehensive end-to-end testing of the user authentication and authorization process.',
      suiteType: 'E2E Testing'
    };

    if (id === '1') {
        this.testSuiteForm.patchValue(mockTestSuite);
    }
  }

  onSubmit(): void {
    if (this.testSuiteForm.valid) {
      if (this.mode === 'create') {
        this.createTestSuite();
      } else {
        this.updateTestSuite();
      }
    }
  }

  createTestSuite(): void {
    console.log('Creating test suite:', this.testSuiteForm.value);
    // API CALL: POST /api/test-suites (for Create).

    // After success:
    this.router.navigate(['/test-suites/list']);
  }

  updateTestSuite(): void {
    console.log('Updating test suite:', this.testSuiteId, this.testSuiteForm.value);
    // API CALL: PUT /api/test-suites/{id} (for Update).

    // After success:
    this.router.navigate(['/test-suites/list']);
  }

  onCancel(): void {
    this.router.navigate(['/test-suites/list']);
  }
}
