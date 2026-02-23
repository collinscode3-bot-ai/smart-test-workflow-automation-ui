import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { LoadingService } from '../../services/loading.service';

interface TestCase {
  id: string;
  name: string;
  status: 'Passed' | 'Failed' | 'In Progress' | 'Pending';
  steps: string[];
  inputData: string;
  expectedResults: string;
}

@Component({
  selector: 'app-test-execution-home',
  templateUrl: './test-execution-home.component.html',
  styleUrls: ['./test-execution-home.component.scss']
})
export class TestExecutionHomeComponent implements OnInit {
  suiteId: string | null = null;
  suiteName: string = 'API Regression Suite';
  suiteDescription: string = 'Comprehensive validation of core authentication, user profile management, and billing endpoints for the production environment.';
  isExecuting: boolean = false;

  testCases: TestCase[] = [
    {
      id: 'TC-001',
      name: 'User Authentication Flow',
      status: 'Passed',
      steps: ['Step 1: Open Login Page', 'Step 2: Enter Credentials', 'Step 3: Click Login'],
      inputData: '{ "username": "testuser", "password": "password123" }',
      expectedResults: 'User should be redirected to dashboard.'
    },
    {
      id: 'TC-002',
      name: 'Password Reset Logic',
      status: 'In Progress',
      steps: ['Step 1: Open Reset Page', 'Step 2: Enter Email', 'Step 3: Click Reset'],
      inputData: '{ "email": "user@example.com" }',
      expectedResults: 'Reset link should be sent to email.'
    },
    {
      id: 'TC-003',
      name: 'JWT Token Validation',
      status: 'Failed',
      steps: ['Step 1: Call API with expired token', 'Step 2: Verify status code'],
      inputData: 'Authorization: Bearer <expired_token>',
      expectedResults: 'API should return 401 Unauthorized.'
    },
    {
      id: 'TC-004',
      name: 'User Profile Update',
      status: 'Pending',
      steps: ['Step 1: Update profile details', 'Step 2: Save changes'],
      inputData: '{ "name": "New Name" }',
      expectedResults: 'Profile should be updated successfully.'
    },
    {
      id: 'TC-005',
      name: 'Delete Account Workflow',
      status: 'Passed',
      steps: ['Step 1: Go to settings', 'Step 2: Click delete account', 'Step 3: Confirm deletion'],
      inputData: 'User ID: 12345',
      expectedResults: 'Account should be removed from database.'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.suiteId = this.route.snapshot.paramMap.get('id');
    this.headerService.setHeaderData('Test Execution', 'Monitor real-time execution results and test case flows.');

    // API CALL: GET /api/test-suites/{id}/execution-details
  }

  runTestSuite(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
      this.isExecuting = true;
    }, 2000);

    // API CALL: POST /api/execution/run
  }

  viewTestCaseFlow(testCaseId: string): void {
    console.log(`Viewing flow for test case ${testCaseId}`);
    // API CALL: GET /api/test-cases/{id}/flow
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Passed': return 'status-passed';
      case 'Failed': return 'status-failed';
      case 'In Progress': return 'status-in-progress';
      case 'Pending': return 'status-pending';
      default: return '';
    }
  }
}
