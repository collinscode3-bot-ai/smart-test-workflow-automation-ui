import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';
import { ValidationParameter } from '../validation-parameter-modal/validation-parameter-modal.component';

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

  // Modal State
  isModalOpen = false;
  modalMode: 'add' | 'edit' | 'view' = 'add';
  selectedParam: ValidationParameter | null = null;

  errorsList: ErrorMessage[] = [
    { errorCode: 'ERR_404_VAL', errorMessage: 'The requested data validation failed for missing resources.' },
    { errorCode: 'ERR_500_SCHEMA', errorMessage: 'Schema mismatch detected in response body.' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private headerService: HeaderService
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

  onSubmit(): void {
    if (this.validationForm.valid) {
      const formData = {
        ...this.validationForm.getRawValue(),
        parameters: this.parametersList,
        errors: this.errorsList
      };
      console.log('Saving Validation Configuration:', formData);

      /*
      // API Integration Placeholder: Save validation
      // this.validationService.saveValidation(formData).subscribe({
      //   next: (response) => {
      //     console.log('Success', response);
      //     this.location.back();
      //   },
      //   error: (err) => {
      //     console.error('Error saving validation', err);
      //   }
      // });
      */

      this.location.back();
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
    console.log('Add Error Message clicked');
    // Logic to open a modal or add a new row to errorsList
  }

  editError(error: ErrorMessage): void {
    console.log('Edit Error:', error);
    /*
    // API Integration Placeholder
    // this.validationService.editError(error.id, ...).subscribe(...);
    */
  }

  deleteError(error: ErrorMessage): void {
    console.log('Delete Error:', error);
    this.errorsList = this.errorsList.filter(e => e !== error);
    /*
    // API Integration Placeholder
    // this.validationService.deleteError(error.id).subscribe(...);
    */
  }

  viewError(error: ErrorMessage): void {
    console.log('View Error:', error);
  }
}
