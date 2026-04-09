import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { WorkflowStateService } from '../../services/workflow-state.service';

interface Project {
  id: string;
  name: string;
  description: string;
  typeIcon: string;
}

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  allProjects: Project[] = [
    { id: '1', name: 'Q3 Brand Audit', description: 'Reviewing current visual assets across all regional distribution centers for compliance with the new brand guidelines established in the previous quarter. This involves a deep dive into logos, color palettes, and typography used in various marketing materials and physical signage.', typeIcon: 'bi-folder' },
    { id: '2', name: 'Website Redesign', description: 'Customer portal enhancement project focusing on mobile-first tracking interface...', typeIcon: 'bi-globe' },
    { id: '3', name: 'App Launch 2024', description: 'Deployment plan for the next generation logistics management application...', typeIcon: 'bi-rocket-takeoff' },
    { id: '4', name: 'API Integration', description: 'Standardizing data exchange protocols between legacy systems and cloud services.', typeIcon: 'bi-cpu' },
    { id: '5', name: 'Market Research', description: 'Analyzing competitor strategies and consumer behavior for the upcoming fiscal year.', typeIcon: 'bi-bar-chart' },
    { id: '6', name: 'Customer Support Bot', description: 'Implementing AI-driven chatbot to handle common customer inquiries and reduce wait times.', typeIcon: 'bi-chat-dots' },
    { id: '7', name: 'Data Migration', description: 'Transferring local database records to a secure, distributed cloud infrastructure.', typeIcon: 'bi-database-up' },
    { id: '8', name: 'Security Patching', description: 'Applying critical security updates across all production environments to ensure data integrity.', typeIcon: 'bi-shield-check' }
  ];

  filteredProjects: Project[] = [];
  paginatedProjects: Project[] = [];

  errorMessage: string | null = null;

  constructor(
    private headerService: HeaderService,
    private workflowService: WorkflowStateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.headerService.setHeaderData('Project Details', 'Manage and monitor your existing projects.');
    this.searchProjects();

    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'missing_parent') {
        this.errorMessage = 'Missing parent context. Please select a project first.';
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  /**
   * Placeholder for GET request to fetch projects from the backend.
   * // API CALL: GET /api/projects?page={n}&search={query}
   * Integration Tip: Use HttpClient to call your API endpoint.
   * Example:
   * return this.http.get<any>(`${API_URL}/projects?page=${page}&search=${search}`)
   *   .subscribe(response => {
   *     this.allProjects = response.data;
   *     this.totalItems = response.total;
   *     this.updatePagination();
   *   });
   *
   * @param page The page number to fetch.
   * @param search Optional search string to filter projects.
   */
  fetchProjects(page: number, search?: string): void {
    // Logic for mock data pagination
    this.currentPage = page;
    this.updatePagination();
  }

  /**
   * Logic to filter the mock data based on the search input.
   * This method is triggered on ogni input change in the search bar.
   */
  searchProjects(): void {
    this.filteredProjects = this.allProjects.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalItems = this.filteredProjects.length;
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Placeholder for DELETE request with a confirmation dialog.
   * // API CALL: DELETE /api/projects/{id}
   * Integration Tip: Call the DELETE endpoint and then refresh the list.
   * Example:
   * this.http.delete(`${API_URL}/projects/${id}`).subscribe(() => this.fetchProjects(this.currentPage));
   *
   * @param id The ID of the project to delete.
   */
  deleteProject(id: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      // Mock deletion logic
      this.allProjects = this.allProjects.filter(p => p.id !== id);
      this.searchProjects();
      console.log(`Project ${id} deleted.`);
    }
  }

  /**
   * Router logic to navigate to the Project Form component in 'edit' mode.
   * It passes the project ID as a query parameter.
   *
   * @param id The ID of the project to edit.
   */
  MapsToEdit(id: string): void {
    this.router.navigate(['/edit'], { queryParams: { id: id } });
  }

  /**
   * Navigates to the Test Suites dashboard for a specific project.
   * @param id The ID of the project.
   */
  goToTestSuites(id: string): void {
    const project = this.allProjects.find(p => p.id === id);
    this.workflowService.setProject(id, project ? project.name : `Project ${id}`);
    this.router.navigate([`/projects/${id}/suites/list`]);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.fetchProjects(page, this.searchTerm);
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/']);
  }
}
