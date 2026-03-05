import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageService } from 'src/app/services/error-message.service';

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
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private errorMessageService: ErrorMessageService
  ) {
    this.parameterForm = this.fb.group({
      paramSequence: ['', Validators.required],
      paramKey: ['', Validators.required],
      paramValuePath: ['', Validators.required],
      paramValueSource: ['', Validators.required],
      valueDataType: ['', Validators.required],
      paramValue: ['', Validators.required]
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
  }

  getErrorMessage(field: string, type: string): string {
    return this.errorMessageService.getErrorMessage('VERIFY_PARAM', field, type);
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
    if (this.parameterForm.valid && !this.isSaving) {
      this.isSaving = true;
      const data = this.parameterForm.getRawValue();
      this.triggerAlert('success', `Parameter ${this.mode === 'edit' ? 'updated' : 'saved'} successfully!`);

      setTimeout(() => {
        this.save.emit(data);
        this.isSaving = false;
      }, 500);
    } else if (this.parameterForm.invalid) {
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
}
