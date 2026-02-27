import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HeaderService } from '../../services/header.service';

interface ValidationParameter {
  seqNo: number;
  type: string;
  value: string | number;
  dataType: string;
}

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
    { seqNo: 1, type: 'Status', value: 200, dataType: 'INTEGER' },
    { seqNo: 2, type: 'Message', value: 'Success', dataType: 'STRING' }
  ];
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
    console.log('Add Parameter clicked');
    // Logic to open a modal or add a new row to parametersList
  }

  editParameter(param: ValidationParameter): void {
    console.log('Edit Parameter:', param);
    /*
    // API Integration Placeholder
    // this.validationService.editParameter(param.id, ...).subscribe(...);
    */
  }

  deleteParameter(param: ValidationParameter): void {
    console.log('Delete Parameter:', param);
    this.parametersList = this.parametersList.filter(p => p !== param);
    /*
    // API Integration Placeholder
    // this.validationService.deleteParameter(param.id).subscribe(...);
    */
  }

  viewParameter(param: ValidationParameter): void {
    console.log('View Parameter:', param);
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
