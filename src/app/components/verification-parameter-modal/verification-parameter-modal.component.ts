import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';

@Component({
  selector: 'app-verification-parameter-modal',
  templateUrl: './verification-parameter-modal.component.html',
  styleUrls: ['./verification-parameter-modal.component.scss']
})
export class VerificationParameterModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() parameterData: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  parameterForm: FormGroup;
  showParamValuePath = false;
  showParamValue = false;

  constructor(
    private fb: FormBuilder,
    private errorMessageService: ErrorMessageService
  ) {
    this.parameterForm = this.fb.group({
      paramSequence: ['', Validators.required],
      paramKey: ['', Validators.required],
      paramValuePath: [''],
      paramValueSource: ['', Validators.required],
      valueDataType: ['', Validators.required],
      paramValue: ['']
    });
  }

  ngOnInit(): void {
    if ((this.mode === 'edit' || this.mode === 'view') && this.parameterData) {
      // GET /api/verification-params/{id} (For Edit mode placeholder)
      this.parameterForm.patchValue(this.parameterData);
    }

    if (this.mode === 'view') {
      this.parameterForm.disable();
    }

    this.parameterForm.get('paramValueSource')?.valueChanges.subscribe((val: string) => {
      this.applyVisibilityAndValidators(val);
    });

    const initialSource = this.parameterForm.get('paramValueSource')?.value;
    if (initialSource) {
      this.applyVisibilityAndValidators(initialSource);
    } else {
      this.applyVisibilityAndValidators('');
    }
  }

  onSave(): void {
    if (this.parameterForm.valid) {
      const data = this.parameterForm.getRawValue();
      // POST /api/verification-params (For Add mode placeholder)
      // PUT /api/verification-params/{id} (For Update placeholder)
      this.save.emit(data);
    } else {
      this.parameterForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    if (this.parameterForm.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.cancel.emit();
      }
    } else {
      this.cancel.emit();
    }
  }

  get isDirty(): boolean {
    return this.parameterForm.dirty;
  }

  getDynamicError(controlName: string, fieldName: string): string {
    const control = this.parameterForm.get(controlName);
    if (control && control.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      const dynamicKey = firstErrorKey.toUpperCase();
      return this.errorMessageService.getErrorMessage('VERIFY_PARAM', fieldName, dynamicKey);
    }
    return '';
  }

  private applyVisibilityAndValidators(source: string) {
    const pathCtrl = this.parameterForm.get('paramValuePath');
    const valueCtrl = this.parameterForm.get('paramValue');

    this.showParamValuePath = source === 'TDV' || source === 'HEADER_KEY';
    this.showParamValue = source === 'STATIC_VALUE';

    if (this.showParamValuePath) {
      pathCtrl?.setValidators([Validators.required]);
    } else {
      pathCtrl?.clearValidators();
    }
    pathCtrl?.updateValueAndValidity({ emitEvent: false });

    if (this.showParamValue) {
      valueCtrl?.setValidators([Validators.required]);
    } else {
      valueCtrl?.clearValidators();
    }
    valueCtrl?.updateValueAndValidity({ emitEvent: false });
  }
}
