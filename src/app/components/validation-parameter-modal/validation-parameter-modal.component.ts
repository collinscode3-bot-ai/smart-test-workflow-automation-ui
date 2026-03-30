import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';
import { LoadingService } from '../../services/loading.service';

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
  @Input() parentPayloadId: string | null = null;
  @Input() parentValidationSourceData: string | null = null;
  @Output() save = new EventEmitter<ValidationParameter>();
  @Output() cancel = new EventEmitter<void>();

  parameterForm: FormGroup;
  tdvRows: FormArray;
  seqNumbers: number[] = Array.from({ length: 100 }, (_, i) => i + 1);
  parameterTypeOptions: Array<{ value: string; label: string }> = [];

  successMessage: string | null = null;
  errorMessage: string | null = null;
  private isLoadingTdvData = false;

  constructor(
    private fb: FormBuilder,
    private errorMessageService: ErrorMessageService,
    private loadingService: LoadingService
  ) {
    this.parameterForm = this.fb.group({
      parameterId: ['', Validators.required],
      parameterType: ['', Validators.required],
      parameterValue: ['', Validators.required],
      parameterSeqNo: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      dataType: ['', Validators.required]
    });
    this.tdvRows = this.fb.array([]);
  }

  ngOnInit(): void {
    this.refreshParameterTypeOptions();
    this.setupTdvTableVisibility();

    // Recompute parameterValue when parameterType changes (used for JSON_VALIDATION auto-value)
    this.parameterForm.get('parameterType')?.valueChanges.subscribe(() => {
      this.computeAndSetParameterValue();
    });

    if ((this.mode === 'edit' || this.mode === 'view') && this.parameterData) {
      // API CALL: GET /api/validations/parameters/{id} (to fetch data for Edit mode).
      this.parameterForm.patchValue(this.parameterData);
    }

    if (this.mode === 'view') {
      this.parameterForm.disable();
      this.tdvRows.disable({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['parentValidationName'] ||
      changes['parentValidationType'] ||
      changes['parentPayloadId'] ||
      changes['parentValidationSourceData']
    ) {
      this.refreshParameterTypeOptions();
      this.computeAndSetParameterValue();
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

  get isTdvSelected(): boolean {
    return this.parameterForm.get('parameterType')?.value === 'TDV';
  }

  get tdvRowsControls(): FormGroup[] {
    return this.tdvRows.controls as FormGroup[];
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

  private setupTdvTableVisibility(): void {
    this.parameterForm.get('parameterType')?.valueChanges.subscribe((paramType: string) => {
      if (paramType === 'TDV') {
        this.loadTdvTableData();
      } else {
        this.tdvRows.clear();
      }
    });

    if (this.isTdvSelected) {
      this.loadTdvTableData();
    }
  }

  // Compute and optionally disable the parameterValue control when parentValidationType === 'JSON_VALIDATION'
  private computeAndSetParameterValue(): void {
    const control = this.parameterForm.get('parameterValue');
    const paramType = this.parameterForm.get('parameterType')?.value;
    const payloadId = this.parentPayloadId || '';

    if (this.parentValidationType === 'JSON_VALIDATION') {
      // When JSON_VALIDATION, auto-compute parameterValue from paramType + '$' + payloadId
      const computed = paramType ? `${paramType}$${payloadId}` : '';
      if (control) {
        control.setValue(computed, { emitEvent: false });
        if (this.mode !== 'view') {
          control.disable({ emitEvent: false });
        }
      }
    } else {
      // Re-enable manual editing when not JSON_VALIDATION
      if (control && control.disabled && this.mode !== 'view') {
        control.enable({ emitEvent: false });
      }
    }
  }

  private loadTdvTableData(): void {
    if (this.isLoadingTdvData) return;
    if (this.tdvRows.length > 0) return;

    this.isLoadingTdvData = true;
    this.loadingService.show();

    /*
      Placeholder for API integration

      When Param Type is TDV, the UI needs to show the "Test Data Verification" table below.
      Replace the setTimeout/mock block with a real API call.

      Suggested steps:
      1) Collect context required by your backend:
         - Selected parent Validation Type (this.parentValidationType)
         - Selected parent Validation Name (this.parentValidationName)
         - Current modal fields (this.parameterForm.get('parameterId')?.value, etc.)
      2) Call a service method (create/inject a ValidationService or TestDataService):
         - Example endpoint (placeholder):
           GET /api/test-data/verifications?validationType={...}&validationName={...}&parameterId={...}
      3) Map API response to rows with these fields:
         - testDataVerificationId
         - testDataId
         - testDataJson
         - expectedValue (editable by user)
      4) Ensure the global "Please wait..." overlay is shown during the request:
         - this.loadingService.show() before call
         - this.loadingService.hide() in finalize() / finally

      RxJS placeholder:
        this.loadingService.show();
        this.testDataService.getTdvRows(...).pipe(
          finalize(() => {
            this.loadingService.hide();
            this.isLoadingTdvData = false;
          })
        ).subscribe({
          next: rows => this.setTdvRows(rows),
          error: () => { this.tdvRows.clear(); }
        });
    */

    setTimeout(() => {
      const mockRows = [
        {
          testDataVerificationId: 'TDV-VRFY-1001',
          testDataId: 'TD-000045',
          testDataJson: '{ "trackingId": "1234567890", "carrier": "FEDEX" }',
          expectedValue: ''
        },
        {
          testDataVerificationId: 'TDV-VRFY-1002',
          testDataId: 'TD-000046',
          testDataJson: '{ "status": "DELIVERED", "deliveryDate": "2026-03-27" }',
          expectedValue: ''
        }
      ];

      this.setTdvRows(mockRows);
      this.loadingService.hide();
      this.isLoadingTdvData = false;
    }, 900);
  }

  private setTdvRows(rows: Array<{ testDataVerificationId: string; testDataId: string; testDataJson: string; expectedValue: string }>): void {
    this.tdvRows.clear();

    rows.forEach(row => {
      const group = this.fb.group({
        testDataVerificationId: [{ value: row.testDataVerificationId, disabled: true }],
        testDataId: [{ value: row.testDataId, disabled: true }],
        testDataJson: [{ value: row.testDataJson, disabled: true }],
        expectedValue: [row.expectedValue]
      });

      if (this.mode === 'view') {
        group.disable({ emitEvent: false });
      }

      this.tdvRows.push(group);
    });
  }

  private refreshParameterTypeOptions(): void {
    const options = this.buildParameterTypeOptions(
      this.parentValidationType,
      this.parentValidationName,
      this.parentPayloadId,
      this.parentValidationSourceData
    );
    this.parameterTypeOptions = options;

    const current = this.parameterForm.get('parameterType')?.value;
    const isCurrentValid = options.some(o => o.value === current);
    if (current && !isCurrentValid) {
      this.parameterForm.get('parameterType')?.setValue('');
    }
  }

  private buildParameterTypeOptions(
    validationType: string | null,
    validationName: string | null,
    payloadId: string | null,
    sourceData: string | null
  ) {
    // Top-level router: delegate to specific builders based on validationType
    // This keeps the mapping logic modular and easier to test.
    if (validationType === 'JSON_VALIDATION') {
      return this.buildJsonValidationOptions(validationName, sourceData);
    }

    if (validationType === 'JSON_FIELD_VALIDATION') {
      return this.buildJsonFieldValidationOptions(validationName, payloadId);
    }

    if (validationType === 'DB_VALIDATION') {
      return this.buildDbValidationOptions(validationName);
    }

    if (validationType === 'CUSTOM_VALIDATION') {
      return this.buildCustomValidationOptions(validationName, sourceData);
    }

    // Default fallback: empty options
    return [];
  }

  /**
   * Build options for JSON_VALIDATION.
   * - 'Strict Equals' exposes TDV and entry/exit payload options depending on sourceData.
   * - 'Check If Upstream Output Matches Input' exposes upstream output and entry payload.
   */
  private buildJsonValidationOptions(validationName: string | null, sourceData: string | null) {
    switch (validationName) {
      case 'Strict Equals': {
        const baseOpts: Array<{ value: string; label: string }> = [
          { value: 'TDV', label: 'Test Data Value' }
        ];
        if (sourceData === 'ENTRY_PAYLOAD') {
          baseOpts.push({ value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' });
        }
        if (sourceData === 'EXIT_PAYLOAD') {
          baseOpts.push({ value: 'JSON_EXIT_PAYLOAD', label: 'Service Exit Payload' });
        }
        return baseOpts;
      }
      case 'Check If Upstream Output Matches Input':
        return [
          { value: 'PREVIOUS_SERVICE_OUTPUT', label: 'Upstream Output' },
          { value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' }
        ];
      default:
        return [];
    }
  }

  /**
   * Build options for JSON_FIELD_VALIDATION based on the validationName.
   * Adds 'PAYLOAD_REF' when payloadId appears to reference a request payload.
   */
  private buildJsonFieldValidationOptions(validationName: string | null, payloadId: string | null) {
    const opts: Array<{ value: string; label: string }> = [];
    switch (validationName) {
      case 'Null':
      case 'Not Null':
      case 'Empty':
      case 'Not Empty':
        opts.push({ value: 'JSON_PATH', label: 'Json Path' });
        return opts;
      case 'Equals':
      case 'Equals Ignorecase':
        opts.push({ value: 'JSON_PATH', label: 'Json Path' });
        opts.push({ value: 'STATIC_VALUE', label: 'Static Value' });
        opts.push({ value: 'TDV', label: 'Test Data Value' });
        break;
      case 'In':
      case 'Not In':
        opts.push({ value: 'JSON_PATH', label: 'Json Path' });
        opts.push({ value: 'STATIC_VALUE', label: 'Static Value' });
        opts.push({ value: 'CHECK_VALUE', label: 'Check Value' });
        break;
      default:
        return opts;
    }

    if (payloadId && payloadId.startsWith('REQ-')) {
      opts.push({ value: 'PAYLOAD_REF', label: 'Payload Reference' });
    }
    return opts;
  }

  /**
   * Build options for DB_VALIDATION.
   */
  private buildDbValidationOptions(validationName: string | null) {
    const opts: Array<{ value: string; label: string }> = [];
    switch (validationName) {
      case 'Record Check':
        opts.push({ value: 'JSON_PATH', label: 'Json Path' });
        opts.push({ value: 'STATIC_VALUE', label: 'Static Value' });
        opts.push({ value: 'QUERY', label: 'Query' });
        opts.push({ value: 'DB_VALIDATION_URL', label: 'Database Validation URL' });
        opts.push({ value: 'DB_VALIDATION_NAME', label: 'Database Validation Name' });
        return opts;
      default:
        return opts;
    }
  }

  /**
   * Build options for CUSTOM_VALIDATION.
   * For 'HTTP POST API CALL' include payload entry/exit options depending on sourceData.
   */
  private buildCustomValidationOptions(validationName: string | null, sourceData: string | null) {
    const opts: Array<{ value: string; label: string }> = [];
    switch (validationName) {
      case 'HTTP POST API CALL':
        opts.push({ value: 'CUSTOM_API_URL', label: 'Custom API URL' });
        if (sourceData === 'ENTRY_PAYLOAD') {
          opts.push({ value: 'JSON_ENTRY_PAYLOAD', label: 'Service Entry Payload' });
        }
        if (sourceData === 'EXIT_PAYLOAD') {
          opts.push({ value: 'JSON_EXIT_PAYLOAD', label: 'Service Exit Payload' });
        }
        return opts;
      default:
        return opts;
    }
  }
}
