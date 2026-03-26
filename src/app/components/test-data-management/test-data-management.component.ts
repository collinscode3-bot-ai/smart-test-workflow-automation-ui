import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'app-test-data-management',
  templateUrl: './test-data-management.component.html',
  styleUrls: ['./test-data-management.component.scss']
})
export class TestDataManagementComponent implements OnInit {
  testDataForm!: FormGroup;
  stagedFiles: File[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSaving = false;
  isDragging = false;
  testCaseId: string | null = null;
  schemaHeaders: string[] = [];

  // Mock data for table
  tableHeaders: string[] = ['ID', 'Dataset Name', 'Records', 'Status'];
  datasets: any[] = [];

  // Pagination properties
  paginatedDatasets: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private errorMessageService: ErrorMessageService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.testDataForm = this.fb.group({
      file: [null, Validators.required],
      payloadHeaders: this.fb.array([])
    });

    this.route.paramMap.subscribe(params => {
      this.testCaseId = params.get('id') || '1'; // Defaulting to '1' for demo purposes if not in route
      this.fetchDatasetsInfo();
    });
  }

  private fetchDatasetsInfo(): void {
    // API Placeholder: Implementation of synchronization logic
    // this.testDataService.getDatasets(this.testCaseId).subscribe(data => {
    //   this.datasets = data;
    //   this.totalItems = this.datasets.length;
    //   this.updatePagination();
    // });

    // Simulated response to populate the "Ready to sync" list view
    this.datasets = [
      { id: 'DS-001', name: 'Order_Processing_Test_Data', records: 1250, status: 'Active' },
      { id: 'DS-002', name: 'User_Profile_Baseline', records: 850, status: 'Active' },
      { id: 'DS-003', name: 'Inventory_Sync_Mock', records: 2100, status: 'Deprecated' },
      { id: 'DS-004', name: 'Payment_Gateway_Scenarios', records: 450, status: 'Active' },
      { id: 'DS-005', name: 'Shipping_Rate_Calculations', records: 300, status: 'Active' },
      { id: 'DS-006', name: 'Notification_Trigger_Events', records: 150, status: 'Active' }
    ];

    // Mock schema headers for verification logic
    this.schemaHeaders = ['ID', 'Dataset Name', 'Records', 'Status'];

    this.totalItems = this.datasets.length;
    this.updatePagination();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any): void {
    if (event.target?.files && event.target.files.length > 0) {
      this.handleFiles(event.target.files);
    }
  }

  private handleFiles(files: FileList): void {
    const validExtensions = ['.xlsx', '.csv'];
    const newFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (validExtensions.includes(extension)) {
        newFiles.push(file);
      }
    }

    if (newFiles.length > 0) {
      this.stagedFiles = [...this.stagedFiles, ...newFiles];
      this.testDataForm.get('file')?.setValue(this.stagedFiles);
      this.testDataForm.get('file')?.markAsTouched();
    }
  }

  removeFile(index: number): void {
    this.stagedFiles.splice(index, 1);
    if (this.stagedFiles.length === 0) {
      this.testDataForm.get('file')?.setValue(null);
    } else {
      this.testDataForm.get('file')?.setValue(this.stagedFiles);
    }
  }

  get payloadHeaders() {
    return this.testDataForm.get('payloadHeaders') as FormArray;
  }

  addHeader() {
    const headerGroup = this.fb.group({
      seqNo: [{ value: this.payloadHeaders.length + 1, disabled: true }],
      headerType: ['', Validators.required],
      headerName: ['', Validators.required],
      headerValue: ['', Validators.required],
      dataType: ['', Validators.required]
    });
    this.payloadHeaders.push(headerGroup);
  }

  removeHeader(index: number) {
    this.payloadHeaders.removeAt(index);
    this.updateSeqNumbers();
  }

  private updateSeqNumbers() {
    this.payloadHeaders.controls.forEach((control, index) => {
      control.get('seqNo')?.setValue(index + 1);
    });
  }

  downloadTemplate(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Header Verification: check if "Data Table Headers" (schema) are available
    if (this.schemaHeaders && this.schemaHeaders.length > 0) {
      // Success Path: trigger download via TemplateService
      if (this.testCaseId) {
        // API CALL: GET /api/templates/generate-excel?id={id}
        this.templateService.downloadExcelTemplate(this.testCaseId, this.schemaHeaders);
      } else {
        console.warn('No testCaseId available for template download');
      }
    } else {
      // Error Path (Validation): populate common error display area
      this.errorMessage = this.errorMessageService.getErrorMessage('TESTDATA', 'TEMPLATE', 'FAILED');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSubmit(): void {
    if (this.testDataForm.invalid) {
      this.testDataForm.markAllAsTouched();
      this.errorMessage = 'Please complete all mandatory fields in Payload Headers and File Upload.';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSaving = true;
    this.successMessage = null;
    this.errorMessage = null;

    // API CALL: POST /api/test-data/upload
    console.log('Uploading files...', this.stagedFiles);

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.successMessage = 'Test data uploaded successfully!';
      this.stagedFiles = [];
      this.testDataForm.reset();
    }, 1500);
  }

  getError(field: string, type: string): string {
    return this.errorMessageService.getErrorMessage('TESTDATA', field, type);
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDatasets = this.datasets.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  deleteRow(id: string): void {
    if (confirm('Are you sure you want to delete this dataset?')) {
      this.datasets = this.datasets.filter(d => d.id !== id);
      this.totalItems = this.datasets.length;
      if (this.currentPage > this.totalPages && this.currentPage > 1) {
        this.currentPage--;
      }
      this.updatePagination();
    }
  }

  onSaveDatasets(): void {
    console.log('Final dataset list saved:', this.datasets);
    this.successMessage = 'All datasets saved successfully!';
    this.errorMessage = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onBack(): void {
    window.history.back();
  }
}
