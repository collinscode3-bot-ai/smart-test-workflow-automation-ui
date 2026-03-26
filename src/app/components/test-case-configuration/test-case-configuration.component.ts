import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { ErrorMessageService } from '../../services/error-message.service';

@Component({
  selector: 'app-test-case-configuration',
  templateUrl: './test-case-configuration.component.html',
  styleUrls: ['./test-case-configuration.component.scss']
})
export class TestCaseConfigurationComponent implements OnInit {
  testCaseForm: FormGroup;
  isEditMode: boolean = false;
  testCaseId: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  payloadFormats: string[] = ['JSON', 'XML', 'Text'];
  actions: string[] = ['GET', 'POST', 'PUT', 'DELETE'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private errorMessageService: ErrorMessageService
  ) {
    this.testCaseForm = this.fb.group({
      testCaseName: ['', Validators.required],
      sequenceNo: ['', Validators.required],
      action: ['', Validators.required],
      inputPayloadFormat: ['JSON', Validators.required],
      triggerUrl: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.testCaseId = params.get('id');
      if (this.testCaseId) {
        this.isEditMode = true;
        this.loadTestCaseData(this.testCaseId);
      } else {
        this.isEditMode = false;
      }
      this.updateHeader();
    });
  }

  updateHeader() {
    const title = this.isEditMode ? 'Edit Test Case' : 'Add Test Case';
    this.headerService.setHeaderData(title, 'Define execution parameters and management modules for your automation suite.');
  }

  loadTestCaseData(id: string) {
    // Simulated API call to fetch test case data
    // In a real application, this would call a service method
    const mockData = {
      testCaseName: 'User_Authentication_Flow_v2',
      sequenceNo: '105',
      action: 'POST',
      inputPayloadFormat: 'JSON',
      triggerUrl: 'https://api.gateway.internal/v2/auth/verify',
      description: 'Validates the end-to-end OAuth2 handshake with bearer token injection and response header verification for enterprise security standards.'
    };
    this.testCaseForm.patchValue(mockData);
  }

  setPayloadFormat(format: string) {
    this.testCaseForm.get('inputPayloadFormat')?.setValue(format);
  }

  getDynamicError(controlName: string, fieldName: string): string {
    const control = this.testCaseForm.get(controlName);
    if (control && control.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      const dynamicKey = firstErrorKey.toUpperCase();
      return this.errorMessageService.getErrorMessage('TESTCASE', fieldName, dynamicKey);
    }
    return '';
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

  onSave() {
    this.testCaseForm.markAllAsTouched();
    if (this.testCaseForm.valid) {
      const formData = this.testCaseForm.getRawValue();
      if (this.isEditMode) {
        console.log('Updating test case:', formData);
        this.triggerAlert('success', 'Test Case updated successfully!');
      } else {
        console.log('Creating new test case:', formData);
        this.triggerAlert('success', 'Test Case saved successfully!');
      }
      // Navigation after success
      setTimeout(() => this.router.navigate(['/test-suites/list']), 2000);
    } else {
      this.triggerAlert('error', 'Please fill all mandatory fields correctly.');
    }
  }

  onDiscard() {
    this.router.navigate(['/test-suites/list']);
  }

  onAction(module: string) {
    console.log(`Action for module: ${module}`);
    // Navigation logic for management modules
  }
}
