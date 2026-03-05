import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { ValidationParameter } from '../validation-parameter-modal/validation-parameter-modal.component';
import { ErrorMessageService } from '../../services/error-message.service';

interface ErrorMessage {
  errorCode: string;
  errorMessage: string;
}

@Component({
  selector: 'app-validation-configuration',
  templateUrl: './validation-configuration.component.html',
  styleUrls: ['./validation-configuration.component.scss']
})
export class ValidationConfigurationComponent implements OnInit {
  validationForm: FormGroup;
  parametersList: ValidationParameter[] = [
    { parameterSeqNo: 1, parameterType: 'Header', parameterValue: 'application/json', parameterId: 'Content-Type', dataType: 'String' },
    { parameterSeqNo: 2, parameterType: 'Body', parameterValue: 'Success', parameterId: 'message', dataType: 'String' }
  ];

  // Modal State for Validation Parameters
  isModalOpen = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedParam: ValidationParameter | null = null;

  // Modal State for Error Messages
  isErrorModalOpen = false;
  errorModalMode: 'add' | 'edit' | 'view' = 'add';
  selectedError: ErrorMessage | null = null;

  errorsList: ErrorMessage[] = [
    { errorCode: 'ERR_404_VAL', errorMessage: 'The requested data validation failed for missing resources.' },
    { errorCode: 'ERR_500_SCHEMA', errorMessage: 'Schema mismatch detected in response body.' }
  ];

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
      seqNo: [{ value: '001', disabled: true }, Validators.required],
      validationName: ['User Status Check', Validators.required],
      expectedOutcome: ['Success', Validators.required],
      payloadId: ['REQ-2024-001', Validators.required],
      payloadFormat: ['JSON', Validators.required],
      validationType: ['Field Validation', Validators.required],
      validationSourceData: ['Response Body', Validators.required]
    });
  }

  ngOnInit(): void {
    // Set Header Data
    this.headerService.setHeaderData(
      'Validations',
      'Configure validation rules and parameters for your test suite.'
    );

    /*
    // API Integration Placeholder: Fetch existing validation details by ID
    const validationId = this.route.snapshot.paramMap.get('id');
    if (validationId) {
      // this.validationService.getValidation(validationId).subscribe(data => {
      //   this.validationForm.patchValue(data);
      //   this.parametersList = data.parameters;
      //   this.errorsList = data.errors;
      // });
    }
    */
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
      console.log('Saving Validation Configuration:', formData);
      this.triggerAlert('success', 'Validation configuration saved successfully!');

      /*
      // API Integration Placeholder: Save validation
      // this.validationService.saveValidation(formData).subscribe({
      //   next: (response) => {
      //     console.log('Success', response);
      //     setTimeout(() => this.location.back(), 5000);
      //   },
      //   error: (err) => {
      //     console.error('Error saving validation', err);
      //     this.triggerAlert('error', 'Failed to save validation configuration.');
      //   }
      // });
      */

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
    this.isModalOpen = true;
  }

  editParameter(param: ValidationParameter): void {
    this.modalMode = 'edit';
    this.selectedParam = { ...param };
    this.isModalOpen = true;
  }

  deleteParameter(param: ValidationParameter): void {
    this.parametersList = this.parametersList.filter(p => p !== param);
  }

  viewParameter(param: ValidationParameter): void {
    this.modalMode = 'view';
    this.selectedParam = { ...param };
    this.isModalOpen = true;
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
