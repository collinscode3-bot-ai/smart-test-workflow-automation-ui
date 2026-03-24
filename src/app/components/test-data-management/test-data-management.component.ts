import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorMessageService } from '../../services/error-message.service';

@Component({
  selector: 'app-test-data-management',
  templateUrl: './test-data-management.component.html',
  styleUrls: ['./test-data-management.component.scss']
})
export class TestDataManagementComponent implements OnInit {
  testDataForm!: FormGroup;
  stagedFiles: File[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSaving = false;
  isDragging = false;

  constructor(
    private fb: FormBuilder,
    private errorMessageService: ErrorMessageService
  ) {}

  ngOnInit(): void {
    this.testDataForm = this.fb.group({
      file: [null, Validators.required]
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any): void {
    if (event.target?.files && event.target.files.length > 0) {
      this.handleFiles(event.target.files);
    }
  }

  private handleFiles(files: FileList): void {
    const validExtensions = ['.xlsx', '.csv'];
    const newFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (validExtensions.includes(extension)) {
        newFiles.push(file);
      }
    }

    if (newFiles.length > 0) {
      this.stagedFiles = [...this.stagedFiles, ...newFiles];
      this.testDataForm.get('file')?.setValue(this.stagedFiles);
      this.testDataForm.get('file')?.markAsTouched();
    }
  }

  removeFile(index: number): void {
    this.stagedFiles.splice(index, 1);
    if (this.stagedFiles.length === 0) {
      this.testDataForm.get('file')?.setValue(null);
    } else {
      this.testDataForm.get('file')?.setValue(this.stagedFiles);
    }
  }

  downloadTemplate(): void {
    // API CALL: GET /api/templates/download
    console.log('Downloading template...');
  }

  onSubmit(): void {
    if (this.testDataForm.invalid) {
      this.testDataForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.successMessage = null;
    this.errorMessage = null;

    // API CALL: POST /api/test-data/upload
    console.log('Uploading files...', this.stagedFiles);

    // Simulate API call
    setTimeout(() => {
      this.isSaving = false;
      this.successMessage = 'Test data uploaded successfully!';
      this.stagedFiles = [];
      this.testDataForm.reset();
    }, 1500);
  }

  getError(field: string, type: string): string {
    return this.errorMessageService.getErrorMessage('TESTDATA', field, type);
  }
}
