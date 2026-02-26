import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-test-case-details',
  templateUrl: './test-case-details.component.html',
  styleUrls: ['./test-case-details.component.scss']
})
export class TestCaseDetailsComponent implements OnInit {
  mode: 'new' | 'edit' = 'new';
  testCaseId: string | null = null;

  testCase = {
    name: '',
    description: ''
  };

  contracts = [
    { id: 1, name: 'Auth Response Schema', type: 'Consumer Contract' },
    { id: 2, name: 'User Profile Definition', type: 'Provider Contract' }
  ];

  verifications = [
    { id: 1, step: 'Status Code is 200', type: 'Response' },
    { id: 2, step: 'Body contains success: true', type: 'Validation' }
  ];

  testData = [
    { id: 1, name: '"Production Credentials Set"', details: '(JSON, 4 fields)' },
    { id: 2, name: '"QA Sandbox Environment"', details: '(JSON, 4 fields)' }
  ];

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Mode Toggle: Use route data to switch between "New" and "Edit"
    this.route.data.subscribe(data => {
      if (data['mode'] === 'edit') {
        this.mode = 'edit';
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
    // Mocking loaded data for edit mode
    this.testCase = {
      name: 'User Authentication Flow',
      description: 'Describe the purpose of this test case...'
    };
  }

  saveTestCase() {
    if (this.mode === 'edit') {
      // API CALL: PUT /api/testcases/{id}
      console.log('Updating test case', this.testCase);
    } else {
      // API CALL: POST /api/testcases
      console.log('Creating new test case', this.testCase);
    }
    this.router.navigate(['/test-suites/list']);
  }

  cancel() {
    this.router.navigate(['/test-suites/list']);
  }

  // CRUD: Logic for adding/deleting rows in each section datatable.

  addContract() {
    console.log('Adding contract...');
    const nextId = this.contracts.length + 1;
    this.contracts.push({ id: nextId, name: 'New Contract', type: 'Consumer Contract' });
  }

  deleteContract(id: number) {
    this.contracts = this.contracts.filter(c => c.id !== id);
  }

  addVerification() {
    console.log('Adding verification...');
    const nextId = this.verifications.length + 1;
    this.verifications.push({ id: nextId, step: 'New Verification Step', type: 'Response' });
  }

  deleteVerification(id: number) {
    this.verifications = this.verifications.filter(v => v.id !== id);
  }

  addTestData() {
    console.log('Adding test data...');
    const nextId = this.testData.length + 1;
    this.testData.push({ id: nextId, name: '"New Test Dataset"', details: '(JSON, 0 fields)' });
  }

  deleteTestData(id: number) {
    this.testData = this.testData.filter(d => d.id !== id);
  }
}
