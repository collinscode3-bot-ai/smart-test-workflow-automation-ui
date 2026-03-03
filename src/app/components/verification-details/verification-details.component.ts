import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { Location } from '@angular/common';

interface VerificationParam {
  id: number;
  paramSequence: number;
  paramKey: string;
  paramValuePath?: string;
  paramValueSource?: string;
  valueDataType?: string;
  paramValue?: string;
}

interface Validation {
  id: number;
  validationName: string;
  payloadSource: string;
  payloadId: string;
  validationType: string;
}

@Component({
  selector: 'app-verification-details',
  templateUrl: './verification-details.component.html',
  styleUrls: ['./verification-details.component.scss']
})
export class VerificationDetailsComponent implements OnInit {
  mode: 'new' | 'edit' | 'view' = 'new';
  projectId: string | null = null;
  suiteId: string | null = null;
  caseId: string | null = null;
  verificationId: string | null = null;
  verificationForm: FormGroup;

  // Modal State
  isModalOpen = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedParam: VerificationParam | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Mock Data
  verificationParams: VerificationParam[] = [];

  validations: Validation[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private headerService: HeaderService,
    private location: Location
  ) {
    this.verificationForm = this.fb.group({
      appName: ['', Validators.required],
      serviceName: ['', Validators.required],
      sequenceNo: [{ value: 10, disabled: true }, Validators.required],
      verificationParamType: ['', Validators.required],
      baseUrl: ['', Validators.required],
      verifyIfPreviousSuccess: [true],
      verificationKeyTypeIsComposite: [false],
      verificationKeyTypeDelimiter: [':']
    });
  }

  ngOnInit(): void {
    // Mode Detection
    this.route.data.subscribe(data => {
      this.mode = data['mode'] === 'edit' ? 'edit' : 'new';
    });

    this.route.queryParamMap.subscribe(params => {
      const modeParam = params.get('mode');
      if (modeParam === 'view') {
        this.mode = 'view';
      } else if (modeParam === 'edit') {
        this.mode = 'edit';
      }
    });

    // Parameter extraction
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      this.suiteId = params.get('suiteId');
      this.caseId = params.get('caseId');
      this.verificationId = params.get('verificationId');

      if ((this.mode === 'edit' || this.mode === 'view') && this.verificationId) {
        const title = this.mode === 'view' ? 'View Verification' : 'Edit Verification';
        this.headerService.setHeaderData(
          title,
          'Configure detailed verification steps and parameters for your test case.'
        );
        this.loadVerification(this.verificationId);
        this.loadValidations(this.verificationId);
      } else {
        this.headerService.setHeaderData(
          'Add Verification',
          'Configure detailed verification steps and parameters for your test case.'
        );
        // In a real app, we might fetch the next sequence number here.
        this.verificationForm.patchValue({ sequenceNo: 10 });
      }
    });

    if (this.mode === 'view') {
      this.verificationForm.disable();
    }
  }

  loadVerification(id: string) {
    // API CALL: GET /api/verifications/{id}
    console.log(`Fetching verification with id: ${id}`);

    // Simulating API response
    const mockResponse = {
      appName: 'Shipment Tracking',
      serviceName: 'TrackServiceV1',
      sequenceNo: 10,
      verificationParamType: 'Query Param',
      baseUrl: 'https://api.fedex.com/track/v1',
      verifyIfPreviousSuccess: true,
      verificationKeyTypeIsComposite: false,
      verificationKeyTypeDelimiter: ':'
    };
    this.verificationForm.patchValue(mockResponse);
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

  onSave() {
    if (this.verificationForm.valid) {
      const formData = this.verificationForm.getRawValue();
      if (this.mode === 'edit') {
        // API CALL: PUT /api/verifications/{id}
        console.log('Updating verification', this.verificationId, formData);
        this.triggerAlert('success', 'Verification updated successfully!');
      } else {
        // API CALL: POST /api/verifications
        console.log('Creating new verification', formData);
        this.triggerAlert('success', 'Verification saved successfully!');
      }

      // ERROR: Set errorMessage (Placeholder for API failures)
      // this.triggerAlert('error', 'An error occurred. Please try again.');

      setTimeout(() => {
        this.location.back();
      }, 5000);
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.location.back();
  }

  loadValidations(id: string) {
    // API CALL: GET /api/verifications/{id}/validations
    console.log(`Fetching validations for verification with id: ${id}`);
  }

  addVerificationParam() {
    this.modalMode = 'add';
    this.selectedParam = null;
    this.isModalOpen = true;
  }

  viewVerificationParam(param: VerificationParam) {
    this.modalMode = 'view';
    this.selectedParam = { ...param };
    this.isModalOpen = true;
  }

  editVerificationParam(param: VerificationParam) {
    this.modalMode = 'edit';
    this.selectedParam = { ...param };
    this.isModalOpen = true;
  }

  deleteVerificationParam(id: number) {
    // UI: window.confirm('Are you sure you want to delete this verification parameter?');
    // API CALL: DELETE /api/verifications/params/{paramId}
    console.log('Deleting verification parameter', id);
    this.verificationParams = this.verificationParams.filter(p => p.id !== id);
  }

  addValidation() {
    const vId = this.verificationId || '1';
    this.router.navigate([`projects/${this.projectId}/suites/${this.suiteId}/testcases/${this.caseId}/verifications/${vId}/validations/new`]);
  }

  viewValidation(val: Validation) {
    const vId = this.verificationId || '1';
    this.router.navigate([`projects/${this.projectId}/suites/${this.suiteId}/testcases/${this.caseId}/verifications/${vId}/validations/edit/${val.id}`]);
  }

  editValidation(val: Validation) {
    const vId = this.verificationId || '1';
    this.router.navigate([`projects/${this.projectId}/suites/${this.suiteId}/testcases/${this.caseId}/verifications/${vId}/validations/edit/${val.id}`]);
  }

  deleteValidation(id: number) {
    // UI: window.confirm('Are you sure you want to delete this validation?');
    // API CALL: DELETE /api/verifications/validations/{valId}
    console.log('Deleting validation', id);
    this.validations = this.validations.filter(v => v.id !== id);
  }

  handleParamSave(data: any) {
    if (this.modalMode === 'add') {
      const nextId = this.verificationParams.length > 0 ? Math.max(...this.verificationParams.map(p => p.id)) + 1 : 1;
      this.verificationParams.push({
        id: nextId,
        ...data
      });
    } else if (this.selectedParam) {
      const index = this.verificationParams.findIndex(p => p.id === this.selectedParam?.id);
      if (index !== -1) {
        this.verificationParams[index] = {
          ...this.verificationParams[index],
          ...data
        };
      }
    }
    this.isModalOpen = false;
  }

  handleParamCancel() {
    this.isModalOpen = false;
  }
}
