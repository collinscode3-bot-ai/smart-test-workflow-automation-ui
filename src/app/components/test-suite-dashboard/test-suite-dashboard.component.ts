import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { WorkflowStateService } from '../../services/workflow-state.service';

interface TestSuite {
  id: string;
  name: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-test-suite-dashboard',
  templateUrl: './test-suite-dashboard.component.html',
  styleUrls: ['./test-suite-dashboard.component.scss']
})
export class TestSuiteDashboardComponent implements OnInit {
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  projectId: string | null = null;
  projectName: string = 'Sample Project'; // Mock project name

  allTestSuites: TestSuite[] = [
    { id: '1', name: 'Login Flow E2E', type: 'E2E Testing', status: 'Passed' },
    { id: '2', name: 'User Profile API', type: 'API Testing', status: 'Failed' },
    { id: '3', name: 'Checkout Process', type: 'E2E Testing', status: 'Passed' },
    { id: '4', name: 'Inventory Sync', type: 'API Testing', status: 'Warning' },
    { id: '5', name: 'Regression Suite', type: 'E2E Testing', status: 'Passed' },
    { id: '6', name: 'Security Audit', type: 'API Testing', status: 'Passed' },
    { id: '7', name: 'Mobile Responsiveness', type: 'UI Testing', status: 'Passed' },
    { id: '8', name: 'Payment Gateway', type: 'API Testing', status: 'Passed' }
  ];

  filteredTestSuites: TestSuite[] = [];
  paginatedTestSuites: TestSuite[] = [];

  constructor(
    private headerService: HeaderService,
    private workflowService: WorkflowStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderData('Test Suite Dashboard', 'Manage and monitor your existing automated testing suites.');

    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
    });

    this.searchTestSuites();
  }

  /**
   * Placeholder for GET request to fetch test suites from the backend.
   * // API CALL: GET /api/test-suites?projectId={projectId}&page={n}&search={query}
   */
  fetchTestSuites(page: number, search?: string): void {
    this.currentPage = page;
    this.updatePagination();
  }

  /**
   * Logic to filter the mock data based on the search input.
   */
  searchTestSuites(): void {
    this.filteredTestSuites = this.allTestSuites.filter(ts =>
      ts.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      ts.type.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalItems = this.filteredTestSuites.length;
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Placeholder for DELETE request.
   * // API CALL: DELETE /api/test-suites/{id}
   */
  deleteTestSuite(id: string): void {
    if (confirm('Are you sure you want to delete this test suite?')) {
      this.allTestSuites = this.allTestSuites.filter(ts => ts.id !== id);
      this.searchTestSuites();
      console.log(`Test suite ${id} deleted.`);
    }
  }

  /**
   * Placeholder for EXECUTE request.
   * // API CALL: POST /api/test-suites/{id}/execute
   */
  executeTestSuite(id: string): void {
    console.log(`Executing test suite ${id}...`);
    const suite = this.allTestSuites.find(ts => ts.id === id);
    this.workflowService.setSuite(id, suite ? suite.name : `Suite ${id}`);
    this.router.navigate([`/projects/${this.projectId}/suites/execution/${id}`]);
  }

  /**
   * Router logic to navigate to the dual-purpose test suite form in 'edit' mode.
   */
  MapsToEdit(id: string): void {
    const suite = this.allTestSuites.find(ts => ts.id === id);
    this.workflowService.setSuite(id, suite ? suite.name : `Suite ${id}`);
    this.router.navigate([`/projects/${this.projectId}/suites/edit/${id}`]);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTestSuites = this.filteredTestSuites.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchTestSuites(page, this.searchTerm);
    }
  }

  navigateToCreate(): void {
    this.workflowService.setSuite(null, null);
    this.router.navigate([`/projects/${this.projectId}/suites/create`]);
  }

  goToTestCases(id: string): void {
    const suite = this.allTestSuites.find(ts => ts.id === id);
    this.workflowService.setSuite(id, suite ? suite.name : `Suite ${id}`);
    this.router.navigate([`/projects/${this.projectId}/suites/${id}/test-cases/list`]);
  }
}
