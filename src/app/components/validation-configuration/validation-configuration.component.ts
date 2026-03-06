import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { ValidationParameter, ValidationContext } from '../validation-parameter-modal/validation-parameter-modal.component';
import { ErrorMessageService } from '../../services/error-message.service';

interface ErrorMessage {
  errorCode: string;
  errorMessage: string;
}

// Define the structure for your options
interface ValidationOption {
  key: string;
  value: string;
}

@Component({
  selector: 'app-validation-configuration',
  templateUrl: './validation-configuration.component.html',
  styleUrls: ['./validation-configuration.component.scss']
})
export class ValidationConfigurationComponent implements OnInit {
  @Input() editData: any;
  isEditMode: boolean = false;
  validationForm: FormGroup;
  parametersList: ValidationParameter[] = [];

  // Modal State for Validation Parameters
  isModalOpen = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedParam: ValidationParameter | null = null;
  modalContext: ValidationContext | null = null;

  // Modal State for Error Messages
  isErrorModalOpen = false;
  errorModalMode: 'add' | 'edit' | 'view' = 'add';
  selectedError: ErrorMessage | null = null;

  errorsList: ErrorMessage[] = [];

validationNameOptions: ValidationOption[] = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private headerService: HeaderService,
    private errorMessageService: ErrorMessageService
  ) {
    this.validationForm = this.fb.group({
      seqNo: [{ value: '', disabled: true }, Validators.required],
      validationName: ['', Validators.required],
      expectedOutcome: ['', Validators.required],
      payloadId: ['', Validators.required],
      payloadFormat: ['', Validators.required],
      validationType: ['', Validators.required],
      validationSourceData: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Mode Detection
    this.isEditMode = this.route.snapshot.data['mode'] === 'edit' || !!this.editData;
    const validationId = this.route.snapshot.paramMap.get('validationId');
    if (validationId) {
      this.isEditMode = true;
    }

    // Set Header Data
    const headerTitle = this.isEditMode ? 'Edit Validation Configuration' : 'Add Validation Configuration';
    this.headerService.setHeaderData(
      headerTitle,
      'Configure validation rules and parameters for your test suite.'
    );

    // Dynamic Validation Name Logic
    this.validationForm.get('validationType')?.valueChanges.subscribe(type => {
      console.log('Value Changed !!');
      this.validationForm.get('validationName')?.setValue('');
      this.updateValidationNameOptions(type);
    });

    // Data Initialization
    if (this.isEditMode) {
      if (this.editData) {
        this.patchValidationData(this.editData);
      } else if (validationId) {
        // API Integration Placeholder: Fetch existing validation details by ID
        this.loadValidationData(validationId);
      }
    }
  }

  private patchValidationData(data: any) {
    this.updateValidationNameOptions(data.validationType);
    this.validationForm.patchValue(data);
    this.parametersList = data.parameters || [];
    this.errorsList = data.errors || [];

    // Ensure validationName is set after patch because valueChanges on validationType might have cleared it
    if (data.validationName) {
      this.validationForm.get('validationName')?.setValue(data.validationName);
    }
  }

  private loadValidationData(id: string) {
    // Simulating API call
    console.log('Fetching validation details for ID:', id);
    const mockData = {
      seqNo: '001',
      validationType: 'JSON_FIELD_VALIDATION',
      validationName: 'NOT_NULL',
      payloadId: 'REQ-2024-001',
      payloadFormat: 'JSON',
      expectedOutcome: 'Success',
      validationSourceData: 'ENTRY_PAYLOAD',
      parameters: [],
      errors: []
    };
    this.patchValidationData(mockData);

    /*
    this.validationService.getValidation(id).subscribe(data => {
      this.patchValidationData(data);
    });
    */
  }
  
 updateValidationNameOptions(type: string) {
  if (type === 'JSON_FIELD_VALIDATION') {
    this.validationNameOptions = [
      { key: 'NULL', value: 'Null' },
      { key: 'NOT_NULL', value: 'Not Null' },
      { key: 'EMPTY', value: 'Empty' },
      { key: 'NOT_EMPTY', value: 'Not Empty' },
      { key: 'EQUALS', value: 'Equals' },
      { key: 'EQUALS_IGNORE_CASE', value: 'Equals Ignore Case' },
      { key: 'IN', value: 'In' },
      { key: 'NOT_IN', value: 'Not In' }
    ];
  } else if (type === 'JSON_VALIDATION') {
    this.validationNameOptions = [
      { key: 'STRICT_EQUALS', value: 'Strict Equals' },
      { key: 'CHECK_IF_UPSTREAM_OUTPUT_MATCHES_INPT', value: 'Check If Upstream Output Matches Input' }
    ];
  } else if (type === 'DB_VALIDATION') {
    this.validationNameOptions = [
      { key: 'RECORD_CHECK', value: 'Record Check' }
    ];
  } else if (type === 'CUSTOM_VALIDATION') {
    this.validationNameOptions = [
      { key: 'API_CALL', value: 'Make API Call' }
    ];
  } else {
    this.validationNameOptions = [];
  }
}

  getDynamicError(controlName: string, fieldName: string): string {
    return this.errorMessageService.getErrorMessage('VALIDATION', fieldName, 'REQUIRED');
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

  onSave(): void {
    if (this.validationForm.valid) {
      const formData = {
        ...this.validationForm.getRawValue(),
        parameters: this.parametersList,
        errors: this.errorsList
      };

      if (this.isEditMode) {
        console.log('Updating Validation Configuration:', formData);
        this.triggerAlert('success', 'Validation configuration updated successfully!');
        /*
        this.validationService.updateValidation(formData).subscribe({
          next: () => setTimeout(() => this.location.back(), 5000),
          error: () => this.triggerAlert('error', 'Failed to update validation configuration.')
        });
        */
      } else {
        console.log('Saving Validation Configuration:', formData);
        this.triggerAlert('success', 'Validation configuration saved successfully!');
        /*
        this.validationService.saveValidation(formData).subscribe({
          next: () => setTimeout(() => this.location.back(), 5000),
          error: () => this.triggerAlert('error', 'Failed to save validation configuration.')
        });
        */
      }

      setTimeout(() => {
        this.location.back();
      }, 5000);
    } else {
      this.validationForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.location.back();
  }

  addParameter(): void {
    this.modalMode = 'add';
    this.selectedParam = null;
    this.updateModalContext();
    this.isModalOpen = true;
  }

  editParameter(param: ValidationParameter): void {
    this.modalMode = 'edit';
    this.selectedParam = { ...param };
    this.updateModalContext();
    this.isModalOpen = true;
  }

  deleteParameter(param: ValidationParameter): void {
    this.parametersList = this.parametersList.filter(p => p !== param);
  }

  viewParameter(param: ValidationParameter): void {
    this.modalMode = 'view';
    this.selectedParam = { ...param };
    this.updateModalContext();
    this.isModalOpen = true;
  }

  private updateModalContext(): void {
    this.modalContext = {
      type: this.validationForm.get('validationType')?.value,
      name: this.validationForm.get('validationName')?.value
    };
  }

  handleParamSave(data: ValidationParameter): void {
    if (this.modalMode === 'add') {
      this.parametersList.push(data);
    } else if (this.selectedParam) {
      const index = this.parametersList.findIndex(p => p.parameterId === this.selectedParam?.parameterId);
      if (index !== -1) {
        this.parametersList[index] = data;
      }
    }
    this.isModalOpen = false;
  }

  handleParamCancel(): void {
    this.isModalOpen = false;
  }

  addErrorMessage(): void {
    this.errorModalMode = 'add';
    this.selectedError = null;
    this.isErrorModalOpen = true;
  }

  editError(error: ErrorMessage): void {
    this.errorModalMode = 'edit';
    this.selectedError = { ...error };
    this.isErrorModalOpen = true;
  }

  deleteError(error: ErrorMessage): void {
    this.errorsList = this.errorsList.filter(e => e !== error);
  }

  viewError(error: ErrorMessage): void {
    this.errorModalMode = 'view';
    this.selectedError = { ...error };
    this.isErrorModalOpen = true;
  }

  handleErrorSave(data: ErrorMessage): void {
    if (this.errorModalMode === 'add') {
      this.errorsList.push(data);
    } else if (this.selectedError) {
      const index = this.errorsList.findIndex(e => e.errorCode === this.selectedError?.errorCode);
      if (index !== -1) {
        this.errorsList[index] = data;
      }
    }
    this.isErrorModalOpen = false;
  }

  handleErrorCancel(): void {
    this.isErrorModalOpen = false;
  }
}
