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

  onSave(): void {
    if (this.errorForm.valid) {
      const data = this.errorForm.getRawValue();
      // API CALL: POST /api/validations/errors (to save new data).
      this.save.emit(data);
    } else {
      this.errorForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
