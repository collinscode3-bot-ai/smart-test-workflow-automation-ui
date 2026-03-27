import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { Location } from '@angular/common';
import { ErrorMessageService } from '../../services/error-message.service';

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
export class VerificationDetailsComponent implements OnInit, AfterViewInit {
  @Input() editData: any = null;
  @Input() forcedMode: 'new' | 'edit' | 'view' | null = null;
  @Output() saveSuccess = new EventEmitter<any>();
  @Output() cancelAction = new EventEmitter<void>();

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
    private location: Location,
    private errorMessageService: ErrorMessageService
  ) {
    this.verificationForm = this.fb.group({
      application: ['', Validators.required],
      serviceName: ['', Validators.required],
      sequenceNo: [10, Validators.required],
      verificationParamsType: ['', Validators.required],
      outputPayloadFormatType: ['', Validators.required],
      baseUrl: ['', Validators.required],
      executeIfPreviousSuccessful: [true],
      isCompositeKey: [false],
      verificationKeyTypeDelimiter: [':']
    });
  }

  ngOnInit(): void {
    if (this.forcedMode) {
      this.mode = this.forcedMode;
      if (this.editData) {
        this.verificationForm.patchValue(this.editData);
        if (this.editData.id) this.verificationId = this.editData.id.toString();
        // Load verification params/validations if needed, or assume they are passed in editData
        // For mock purposes, we'll use what's in editData
      }
    } else {
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
    }

    if (this.mode === 'view') {
      this.verificationForm.disable();
    } else {
      this.verificationForm.enable();
      this.verificationForm.get('sequenceNo')?.disable();
    }

    // Reset delimiter when isCompositeKey is false
    this.verificationForm.get('isCompositeKey')?.valueChanges.subscribe((isComposite: boolean) => {
      if (!isComposite) {
        this.verificationForm.get('verificationKeyTypeDelimiter')?.setValue('');
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 0);
  }

  getError(field: string, type: string): string {
    return this.errorMessageService.getErrorMessage('VERIFY', field, type);
  }

  loadVerification(id: string) {
    // API CALL: GET /api/verifications/{id}
    console.log(`Fetching verification with id: ${id}`);

    // Simulating API response
    const mockResponse = {
      application: 'Shipment Tracking',
      serviceName: 'TrackServiceV1',
      sequenceNo: 10,
      verificationParamsType: 'Query Param',
      baseUrl: 'https://api.fedex.com/track/v1',
      executeIfPreviousSuccessful: true,
      isCompositeKey: false,
      verificationKeyTypeDelimiter: ':'
    };
    this.verificationForm.patchValue(mockResponse);

    // Mock Parameters
    this.verificationParams = [
      { id: 1, paramSequence: 1, paramKey: 'trackingNumber', paramValue: '1234567890' },
      { id: 2, paramSequence: 2, paramKey: 'carrier', paramValue: 'FEDEX' }
    ];
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
      if (this.verificationId) formData.id = this.verificationId;

      if (this.mode === 'edit') {
        // API CALL: PUT /api/verifications/{id}
        console.log('Updating verification', this.verificationId, formData);
        this.triggerAlert('success', 'Verification updated successfully!');
      } else {
        // API CALL: POST /api/verifications
        console.log('Creating new verification', formData);
        this.triggerAlert('success', 'Verification saved successfully!');
      }

      if (this.forcedMode) {
        setTimeout(() => {
          this.saveSuccess.emit(formData);
        }, 1000);
      } else {
        setTimeout(() => {
          this.location.back();
        }, 2000);
      }
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  onCancel() {
    if (this.forcedMode) {
      this.cancelAction.emit();
    } else {
      this.location.back();
    }
  }

  loadValidations(id: string) {
    // API CALL: GET /api/verifications/{id}/validations
    console.log(`Fetching validations for verification with id: ${id}`);

    // Mock Validations
    this.validations = [
      { id: 1, validationName: 'Check Status Code', payloadSource: 'Response', payloadId: 'StatusCode', validationType: 'Equals' },
      { id: 2, validationName: 'Verify Tracking ID', payloadSource: 'Body', payloadId: 'trackingId', validationType: 'Equals' }
    ];
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
