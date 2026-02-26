import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';

interface Contract {
  id: number;
  name: string;
  type: string;
}

interface Verification {
  id: number;
  step: string;
  type: string;
}

interface TestData {
  id: number;
  name: string;
  details: string;
}

@Component({
  selector: 'app-test-case-details',
  templateUrl: './test-case-details.component.html',
  styleUrls: ['./test-case-details.component.scss']
})
export class TestCaseDetailsComponent implements OnInit {
  mode: 'new' | 'edit' = 'new';
  testCaseId: string | null = null;
  testCaseForm: FormGroup;

  // Mock Data Arrays
  contracts: Contract[] = [
    { id: 1, name: 'Auth Response Schema', type: 'Consumer Contract' },
    { id: 2, name: 'User Profile Definition', type: 'Provider Contract' }
  ];

  verifications: Verification[] = [
    { id: 1, step: 'Status Code is 200', type: 'Response' },
    { id: 2, step: 'Body contains success: true', type: 'Validation' }
  ];

  testData: TestData[] = [
    { id: 1, name: 'Production Credentials Set', details: '(JSON, 4 fields)' },
    { id: 2, name: 'QA Sandbox Environment', details: '(JSON, 4 fields)' }
  ];

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize Reactive Form
    this.testCaseForm = this.fb.group({
      testCaseName: ['', Validators.required],
      sequenceNo: [{ value: 1, disabled: true }, Validators.required],
      actionType: ['', Validators.required],
      payloadFormat: ['', Validators.required],
      isConditionalExecute: [false],
      triggerUrl: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Mode Toggle logic
    this.route.data.subscribe(data => {
      if (data['mode'] === 'edit') {
        this.mode = 'edit';
      } else {
        this.mode = 'new';
      }
    });

    this.route.paramMap.subscribe(params => {
      this.testCaseId = params.get('id');
      if (this.mode === 'edit' && this.testCaseId) {
        this.loadTestCase(this.testCaseId);
      }
    });

    // Header Integration
    this.headerService.setHeaderData(
      'TestCase Details',
      'Configure your test case parameters and associated contracts.'
    );
  }

  loadTestCase(id: string) {
    // API CALL: GET /api/testcases/{id}
    console.log(`Fetching test case with id: ${id}`);

    // Simulating API response with mock data
    const mockData = {
      testCaseName: 'User Authentication Flow',
      sequenceNo: 1,
      actionType: 'GET',
      payloadFormat: 'JSON',
      isConditionalExecute: true,
      triggerUrl: 'https://api.example.com/v1/auth',
      description: 'Standard end-to-end verification of the user login and profile retrieval process.'
    };

    this.testCaseForm.patchValue(mockData);
  }

  onSave() {
    if (this.testCaseForm.valid) {
      const formData = this.testCaseForm.value;
      if (this.mode === 'edit') {
        // API CALL: PUT /api/testcases/{id}
        console.log('Updating test case', formData);
      } else {
        // API CALL: POST /api/testcases
        console.log('Creating new test case', formData);
      }
      this.router.navigate(['/test-suites/list']);
    } else {
      this.testCaseForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/test-suites/list']);
  }

  // CRUD: Logic for adding/deleting rows in each section datatable.

  addContract() {
    const nextId = this.contracts.length > 0 ? Math.max(...this.contracts.map(c => c.id)) + 1 : 1;
    this.contracts.push({
      id: nextId,
      name: `New Contract ${nextId}`,
      type: 'Consumer Contract'
    });
  }

  editContract(id: number) {
    console.log(`Editing contract with id: ${id}`);
    // Logic for editing a contract
  }

  deleteContract(id: number) {
    this.contracts = this.contracts.filter(c => c.id !== id);
  }

  addVerification() {
    const nextId = this.verifications.length > 0 ? Math.max(...this.verifications.map(v => v.id)) + 1 : 1;
    this.verifications.push({
      id: nextId,
      step: `New Verification Step ${nextId}`,
      type: 'Response'
    });
  }

  editVerification(id: number) {
    console.log(`Editing verification with id: ${id}`);
    // Logic for editing a verification
  }

  deleteVerification(id: number) {
    this.verifications = this.verifications.filter(v => v.id !== id);
  }

  addTestData() {
    const nextId = this.testData.length > 0 ? Math.max(...this.testData.map(d => d.id)) + 1 : 1;
    this.testData.push({
      id: nextId,
      name: `New Test Dataset ${nextId}`,
      details: '(JSON, 0 fields)'
    });
  }

  editTestData(id: number) {
    console.log(`Editing test data with id: ${id}`);
    // Logic for editing test data
  }

  deleteTestData(id: number) {
    this.testData = this.testData.filter(d => d.id !== id);
  }
}
