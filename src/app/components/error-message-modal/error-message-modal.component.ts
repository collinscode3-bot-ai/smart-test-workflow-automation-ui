import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface ErrorMessage {
  errorCode: string;
  errorMessage: string;
}

@Component({
  selector: 'app-error-message-modal',
  templateUrl: './error-message-modal.component.html',
  styleUrls: ['./error-message-modal.component.scss']
})
export class ErrorMessageModalComponent implements OnInit {
  @Input() mode: 'add' | 'edit' | 'view' = 'add';
  @Input() errorData: ErrorMessage | null = null;
  @Output() save = new EventEmitter<ErrorMessage>();
  @Output() cancel = new EventEmitter<void>();

  errorForm: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.errorForm = this.fb.group({
      errorCode: ['', [Validators.required]],
      errorMessage: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if ((this.mode === 'edit' || this.mode === 'view') && this.errorData) {
      // API CALL: GET /api/validations/errors/{id} (to fetch data for Edit mode).
      this.errorForm.patchValue(this.errorData);
    }

    if (this.mode === 'view') {
      this.errorForm.disable();
    }

    // Listen to errorCode changes for auto-formatting
    this.errorForm.get('errorCode')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedValue = value.replace(/\s/g, '').toUpperCase();
        if (value !== formattedValue) {
          this.errorForm.get('errorCode')?.patchValue(formattedValue, { emitEvent: false });
        }
      }
    });
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
    if (this.errorForm.valid) {
      const data = this.errorForm.getRawValue();
      // API CALL: POST /api/validations/errors (to save new data).

      this.triggerAlert('success', 'Error message saved successfully!');

      // ERROR: Set errorMessage (Placeholder for API failures)
      // this.triggerAlert('error', 'Failed to save error message. Please try again.');

      setTimeout(() => {
        this.save.emit(data);
      }, 5000);
    } else {
      this.errorForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
