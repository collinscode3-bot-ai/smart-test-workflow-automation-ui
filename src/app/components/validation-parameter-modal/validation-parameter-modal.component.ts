import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';

export interface ValidationParameter {
  parameterId: string;
  parameterType: string;
  parameterValue: string;
  parameterSeqNo: number;
  dataType: string;
}

@Component({
  selector: 'app-validation-parameter-modal',
  templateUrl: './validation-parameter-modal.component.html',
  styleUrls: ['./validation-parameter-modal.component.scss']
})
export class ValidationParameterModalComponent implements OnInit, OnChanges {
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() parameterData: ValidationParameter | null = null;
  @Input() parentValidationName: string | null = null;
  @Input() parentValidationType: string | null = null;
  @Output() save = new EventEmitter<ValidationParameter>();
  @Output() cancel = new EventEmitter<void>();

  parameterForm: FormGroup;
  seqNumbers: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  parameterTypeOptions: Array<{ value: string; label: string }> = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private errorMessageService: ErrorMessageService
  ) {
    this.parameterForm = this.fb.group({
      parameterId: ['', Validators.required],
      parameterType: ['', Validators.required],
      parameterValue: ['', Validators.required],
      parameterSeqNo: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      dataType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.refreshParameterTypeOptions();

    if ((this.mode === 'edit' || this.mode === 'view') && this.parameterData) {
      // API CALL: GET /api/validations/parameters/{id} (to fetch data for Edit mode).
      this.parameterForm.patchValue(this.parameterData);
    }

    if (this.mode === 'view') {
      this.parameterForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentValidationName'] || changes['parentValidationType']) {
      this.refreshParameterTypeOptions();
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

  onSave(): void {
    if (this.parameterForm.valid) {
      const data = this.parameterForm.getRawValue();
      // API CALL: POST /api/validations/parameters (to save new data).
      // LOGIC: Emit data back to the 'Validation Parameters' table in the parent component.

      this.triggerAlert('success', 'Parameter saved successfully!');

      // ERROR: Set errorMessage (Placeholder for API failures)
      // this.triggerAlert('error', 'Failed to save parameter. Please try again.');

      setTimeout(() => {
        this.save.emit(data);
      }, 500);
    } else {
      this.parameterForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getDynamicError(controlName: string, fieldName: string): string {
    const control = this.parameterForm.get(controlName);
    if (control && control.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      const dynamicKey = firstErrorKey.toUpperCase();
      return this.errorMessageService.getErrorMessage('VALIDATION_PARAM', fieldName, dynamicKey);
    }
    return '';
  }

  private refreshParameterTypeOptions(): void {
    const options = this.buildParameterTypeOptions(this.parentValidationType, this.parentValidationName);
    this.parameterTypeOptions = options;

    const current = this.parameterForm.get('parameterType')?.value;
    const isCurrentValid = options.some(o => o.value === current);
    if (current && !isCurrentValid) {
      this.parameterForm.get('parameterType')?.setValue('');
    }
  }

  private buildParameterTypeOptions(validationType: string | null, validationName: string | null) {
    /*
      Parent-driven Param Type options
      Update this mapping as per your business rules:
      - validationType comes from parent form control: validationType
      - validationName comes from parent form control: validationName
    */

    if (validationType === 'JSON_VALIDATION') {
      switch (validationName) {
        case 'Strict Equals':
          return [
            { value: 'TDV', label: 'Test Data Value' },
            { value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' },
            { value: 'JSON_EXIT_PAYLOAD', label: 'Service Exit Payload' }
          ];
          case 'Check If Upstream Output Matches Input':
          return [
            { value: 'PREVIOUS_SERVICE_OUTPUT', label: 'Previous Service Output' },
            { value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' },
            { value: 'JSON_EXIT_PAYLOAD', label: 'Service Exit Payload' }
          ];
        default:
          return [];
      }
    }

    if (validationType === 'DB_VALIDATION') {
      return [
        { value: 'JSON_PATH', label: 'Json Path' },
        { value: 'STATIC_VALUE', label: 'Static Value' },
        { value: 'TDV', label: 'Test Data Value' },
        { value: 'QUERY', label: 'Query' },
        { value: 'DB_VALIDATION_URL', label: 'Database Validation URL' },
        { value: 'DB_VALIDATION_NAME', label: 'Database Validation Name' }
      ];
    }

    if (validationType === 'CUSTOM_VALIDATION') {
      return [
        { value: 'CUSTOM_API_URL', label: 'Custom API URL' },
        { value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' },
        { value: 'JSON_EXIT_PAYLOAD', label: 'Service Exit Payload' }
      ];
    }

    if (validationType === 'JSON_FIELD_VALIDATION') {
      return [
        { value: 'JSON_PATH', label: 'Json Path' },
        { value: 'STATIC_VALUE', label: 'Static Value' },
        { value: 'TDV', label: 'Test Data Value' },
        { value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' }
      ];
    }

    /*
      Default fallback when parent values are not selected yet.
      Keep this list minimal to avoid incorrect choices.
    */
    return [];
  }
}
