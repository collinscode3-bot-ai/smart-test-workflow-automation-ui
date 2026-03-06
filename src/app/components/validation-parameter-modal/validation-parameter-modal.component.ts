import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';

export interface ValidationParameter {
  parameterId: string;
  parameterType: string;
  parameterValue: string;
  parameterSeqNo: number;
  dataType: string;
}

export interface ValidationContext {
  type: string;
  name: string;
}

@Component({
  selector: 'app-validation-parameter-modal',
  templateUrl: './validation-parameter-modal.component.html',
  styleUrls: ['./validation-parameter-modal.component.scss']
})
export class ValidationParameterModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() parameterData: ValidationParameter | null = null;
  @Input() context: ValidationContext | null = null;
  @Output() save = new EventEmitter<ValidationParameter>();
  @Output() cancel = new EventEmitter<void>();

  parameterForm: FormGroup;
  parameterOptions: { key: string; value: string }[] = [];
  seqNumbers: number[] = Array.from({ length: 100 }, (_, i) => i + 1);

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
    this.loadFilteredOptions();

    if ((this.mode === 'edit' || this.mode === 'view') && this.parameterData) {
      // API CALL: GET /api/validations/parameters/{id} (to fetch data for Edit mode).
      this.parameterForm.patchValue(this.parameterData);
    }

    if (this.mode === 'view') {
      this.parameterForm.disable();
    }
  }

  loadFilteredOptions(): void {
    if (!this.context) {
      this.parameterOptions = [];
      return;
    }

    const { type, name } = this.context;

    // Logic Pattern: Use a conditional switch or a lookup map to populate the modal's dropdown array based on this.context.type and this.context.name
    if (type === 'JSON_FIELD_VALIDATION') {
      switch (name) {
        case 'EQUALS':
        case 'EQUALS_IGNORE_CASE':
          this.parameterOptions = [
            { key: 'EXPECTED_VALUE', value: 'Expected Value' },
            { key: 'PATH', value: 'JSON Path' }
          ];
          break;
        case 'IN':
        case 'NOT_IN':
          this.parameterOptions = [
            { key: 'VALUE_LIST', value: 'Value List' },
            { key: 'DELIMITER', value: 'Delimiter' }
          ];
          break;
        default:
          this.parameterOptions = [
            { key: 'FIELD_PATH', value: 'Field Path' }
          ];
      }
    } else if (type === 'JSON_VALIDATION') {
      this.parameterOptions = [
        { key: 'EXCLUDE_FIELDS', value: 'Exclude Fields' },
        { key: 'IGNORE_ORDER', value: 'Ignore Order' }
      ];
    } else if (type === 'DB_VALIDATION') {
      this.parameterOptions = [
        { key: 'SQL_QUERY', value: 'SQL Query' },
        { key: 'COLUMN_NAME', value: 'Column Name' }
      ];
    } else if (type === 'CUSTOM_VALIDATION') {
      this.parameterOptions = [
        { key: 'CUSTOM_PARAM', value: 'Custom Parameter' }
      ];
    } else {
      this.parameterOptions = [];
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
}
