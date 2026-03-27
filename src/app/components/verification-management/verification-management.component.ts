import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { VerificationDetailsComponent } from '../verification-details/verification-details.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verification-management',
  templateUrl: './verification-management.component.html',
  styleUrls: ['./verification-management.component.scss']
})
export class VerificationManagementComponent implements OnInit {
  @ViewChild(VerificationDetailsComponent) verificationDetails?: VerificationDetailsComponent;

  mockVerifications = [
    { id: 1, verificationName: "Status Code Check", verificationType: "HTTP_STATUS", application: "Auth Service", serviceName: "StatusCheck", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.auth.com", status: "Active" },
    { id: 2, verificationName: "Validate User ID", verificationType: "JSON_BODY", application: "User Profile", serviceName: "UserValidator", verificationParamsType: "PATH_PARAMS", baseUrl: "https://api.users.com", status: "Active" },
    { id: 3, verificationName: "Auth Token Presence", verificationType: "HEADER_CHECK", application: "Gateway", serviceName: "TokenCheck", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.gateway.com", status: "Active" },
    { id: 4, verificationName: "Response Header Key", verificationType: "HEADER_CHECK", application: "Gateway", serviceName: "HeaderCheck", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.gateway.com", status: "Active" },
    { id: 5, verificationName: "Payload Content Type", verificationType: "HTTP_STATUS", application: "File Server", serviceName: "ContentValidator", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.files.com", status: "Active" },
    { id: 6, verificationName: "Database Consistency", verificationType: "DB_CHECK", application: "Inventory DB", serviceName: "ConsistencyCheck", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.db.com", status: "Active" },
    { id: 7, verificationName: "Token Expiry Time", verificationType: "JSON_BODY", application: "IAM", serviceName: "ExpiryCheck", verificationParamsType: "PATH_PARAMS", baseUrl: "https://api.iam.com", status: "Active" },
    { id: 8, verificationName: "XML Response Root", verificationType: "XML_VALIDATION", application: "Legacy API", serviceName: "RootValidator", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.legacy.com", status: "Active" },
    { id: 9, verificationName: "API Latency Threshold", verificationType: "PERFORMANCE", application: "Public API", serviceName: "LatencyCheck", verificationParamsType: "QUERY_PARAMS", baseUrl: "https://api.public.com", status: "Active" },
    { id: 10, verificationName: "User Role Authorization", verificationType: "JSON_BODY", application: "IAM", serviceName: "RoleCheck", verificationParamsType: "PATH_PARAMS", baseUrl: "https://api.iam.com", status: "Active" }
  ];

  isFormVisible = false;
  selectedVerification: any = null;
  formMode: 'new' | 'edit' | 'view' = 'new';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;

  projectId: string = '1';
  suiteId: string = '1';
  caseId: string = '1';

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId') || '1';
      this.suiteId = params.get('suiteId') || '1';
      this.caseId = params.get('caseId') || '1';
    });

    this.headerService.setHeaderData(
      'Verification Management',
      'Manage and configure detailed verification steps and parameters for your test case.'
    );
  }

  get totalPages(): number {
    return Math.ceil(this.mockVerifications.length / this.itemsPerPage);
  }

  get paginatedVerifications(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.mockVerifications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleForm(mode: 'new' | 'edit' | 'view', data: any = null) {
    if (mode === 'view') {
      this.viewFullDetails(data.id);
      return;
    }

    this.formMode = mode;
    this.selectedVerification = data ? { ...data } : null;
    this.isFormVisible = true;

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  viewFullDetails(verificationId: number) {
    this.router.navigate([`/projects/${this.projectId}/suites/${this.suiteId}/testcases/${this.caseId}/verifications/edit/${verificationId}`], {
      queryParams: { mode: 'view' }
    });
  }

  handleSaveSuccess(updatedData: any) {
    if (this.formMode === 'edit') {
      const index = this.mockVerifications.findIndex(v => v.id == updatedData.id);
      if (index !== -1) {
        this.mockVerifications[index] = {
          ...this.mockVerifications[index],
          ...updatedData,
          verificationName: updatedData.application // Map application to verificationName for the list
        };
      }
    } else {
      const newId = this.mockVerifications.length > 0 ? Math.max(...this.mockVerifications.map(v => v.id)) + 1 : 1;
      this.mockVerifications.push({
        ...updatedData,
        id: newId
      });
    }
    this.isFormVisible = false;
    this.selectedVerification = null;
    this.triggerAlert('success', 'Verifications updated successfully!');
  }

  handleCancel() {
    this.isFormVisible = false;
    this.selectedVerification = null;
  }

  saveAllVerifications() {
    if (this.isFormVisible && this.verificationDetails) {
      this.verificationDetails.onSave();
    } else {
      console.log('Final verification list saved:', this.mockVerifications);
      this.triggerAlert('success', 'All changes to the verification list have been saved successfully.');
    }
  }

  deleteVerification(id: number) {
    if (confirm('Are you sure you want to delete this verification?')) {
      this.mockVerifications = this.mockVerifications.filter(v => v.id !== id);
      if (this.currentPage > this.totalPages && this.currentPage > 1) {
        this.currentPage--;
      }
      this.triggerAlert('success', 'Verification deleted successfully.');
    }
  }

  private triggerAlert(type: 'success' | 'error', message: string) {
    if (type === 'success') {
      this.successMessage = message;
      this.errorMessage = null;
    } else {
      this.errorMessage = message;
      this.successMessage = null;
    }
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 5000);
  }

  onBack() {
    window.history.back();
  }
}
