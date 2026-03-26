import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { ErrorMessageService } from '../../services/error-message.service';
import { flatten } from 'flat';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss']
})
export class ContractDetailsComponent implements OnInit {
  @Input() editData: any = null;
  @Input() forcedMode: 'new' | 'edit' | 'view' | null = null;
  @Output() saveSuccess = new EventEmitter<any>();
  @Output() cancelAction = new EventEmitter<void>();

  mode: 'new' | 'edit' | 'view' = 'new';
  contractId: string | null = null;
  contractForm: FormGroup;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // UI State
  schemaMode: 'upload' | 'editor' = 'upload';
  baseContractMode: 'upload' | 'editor' = 'editor';
  isPropertyModalOpen = false;
  propertyModalMode: 'add' | 'edit' = 'add';
  selectedProperty: any = null;
  selectedPropertyIndex: number | null = null;
  currentBaseContractJson: any = null;

  configuredFieldProperties: any[] = [];

  // Mock Data
  sampleSchema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "contractId": { "type": "string" },
      "version": { "type": "string" },
      "status": { "type": "string" }
    }
  };

  sampleBaseContract = {
    "contractId": "UUID-7821-X",
    "version": "1.0.0",
    "data": {
      "status": "active",
      "params": {}
    }
  };

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private errorMessageService: ErrorMessageService
  ) {
    this.contractForm = this.fb.group({
      contractName: ['', Validators.required],
      contractType: ['', Validators.required],
      description: ['', Validators.required],
      baseContract: [JSON.stringify(this.sampleBaseContract, null, 2), Validators.required],
      schemaContract: [JSON.stringify(this.sampleSchema, null, 2)],
      propertyName: [''],
      propertyDescription: ['']
    });
  }

  ngOnInit(): void {
    this.contractForm.get('contractType')?.valueChanges.subscribe(() => {
      this.onContractTypeChange();
    });

    if (this.forcedMode) {
      this.mode = this.forcedMode;
      if (this.editData) {
        this.contractForm.patchValue(this.editData);
        if (this.editData.id) this.contractId = this.editData.id.toString();
        this.onContractTypeChange();
      }
    } else {
      // Mode Detection from Route
      this.route.data.subscribe(data => {
        this.mode = data['mode'] === 'edit' ? 'edit' : 'new';
      });

      this.route.queryParamMap.subscribe(params => {
        const modeParam = params.get('mode');
        if (modeParam === 'view') {
          this.mode = 'view';
        } else if (modeParam === 'edit') {
          this.mode = 'edit';
        }
      });

      this.route.paramMap.subscribe(params => {
        this.contractId = params.get('id');
        if ((this.mode === 'edit' || this.mode === 'view') && this.contractId) {
          this.loadContract(this.contractId);
        }
      });
    }

    this.onContractTypeChange();

    if (this.mode === 'view') {
      this.contractForm.disable();
    }

    // Header Service Integration - only if not in embedded mode (forcedMode)
    if (!this.forcedMode) {
      const title = this.mode === 'view' ? 'View Contract' : (this.mode === 'edit' ? 'Edit Contract' : 'Contract Details');
      this.headerService.setHeaderData(
        title,
        'Define the structural and baseline data for your test suites by providing schema definitions.'
      );
    }
  }

  loadContract(id: string) {
    console.log(`Fetching contract with id: ${id}`);

    // Simulating API response
    const mockResponse = {
      contractName: 'Auth Response Schema',
      contractType: 'Consumer',
      description: 'Baseline schema for authentication response verification.',
      baseContract: JSON.stringify(this.sampleBaseContract, null, 2),
      schemaContract: JSON.stringify(this.sampleSchema, null, 2),
      propertyName: '',
      propertyDescription: ''
    };
    this.contractForm.patchValue(mockResponse);
    this.onContractTypeChange();
  }

  onContractTypeChange() {
    const isTriggerContract = this.contractForm.get('contractType')?.value === 'TRIGGER_CONTRACT';
    const propertyName = this.contractForm.get('propertyName');
    const propertyDescription = this.contractForm.get('propertyDescription');

    if (isTriggerContract) {
      propertyName?.setValidators([Validators.required]);
      propertyDescription?.setValidators([Validators.required]);
    } else {
      propertyName?.clearValidators();
      propertyDescription?.clearValidators();
      propertyName?.setValue('');
      propertyDescription?.setValue('');
    }
    propertyName?.updateValueAndValidity();
    propertyDescription?.updateValueAndValidity();
  }

  getError(field: string, type: string): string {
    return this.errorMessageService.getErrorMessage('CONTRACT', field, type);
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
    if (this.contractForm.valid) {
      const formData = this.contractForm.value;
      if (this.contractId) formData.id = this.contractId;

      // API CALL: POST /api/contracts/validate-json (to verify JSON structure before saving).
      console.log('Validating JSON structure...');

      if (this.mode === 'edit') {
        console.log('Updating contract', this.contractId, formData);
        this.triggerAlert('success', 'Contract updated successfully!');
      } else {
        console.log('Creating new contract', formData);
        this.triggerAlert('success', 'Contract created successfully!');
      }

      if (this.forcedMode) {
        setTimeout(() => {
          this.saveSuccess.emit(formData);
        }, 1000);
      } else {
        setTimeout(() => {
          window.history.back();
        }, 2000);
      }
    } else {
      this.contractForm.markAllAsTouched();
      // Ensure fields are marked as dirty for validation styling
      Object.keys(this.contractForm.controls).forEach(key => {
        this.contractForm.get(key)?.markAsDirty();
      });
    }
  }

  onCancel() {
    if (this.forcedMode) {
      this.cancelAction.emit();
    } else {
      window.history.back();
    }
  }

  onFileUpload(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;

        // LOGIC: Handle XML to JSON conversion for flattening.
        // if (file.name.endsWith('.xml')) { ... }

        if (this.validateJson(content)) {
          this.contractForm.get(field)?.setValue(content);
          this.contractForm.get(field)?.markAsDirty();
        } else {
          this.triggerAlert('error', 'Invalid JSON content.');
        }
      };
      reader.readAsText(file);
    }
  }

  validateJson(json: string): boolean {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }

  flattenSource(data: any): string[] {
    if (!data) return [];
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      const flattened: any = flatten(parsed);
      return Object.keys(flattened);
    } catch (e) {
      console.error('Failed to flatten JSON:', e);
      return [];
    }
  }

  // Field Properties Modal Handlers
  openAddPropertyModal() {
    this.prepareModalData();
    this.propertyModalMode = 'add';
    this.selectedProperty = null;
    this.selectedPropertyIndex = null;
    this.isPropertyModalOpen = true;
  }

  openEditPropertyModal(property: any, index: number) {
    this.prepareModalData();
    this.propertyModalMode = 'edit';
    this.selectedProperty = { ...property };
    this.selectedPropertyIndex = index;
    this.isPropertyModalOpen = true;
  }

  private prepareModalData() {
    const baseContractValue = this.contractForm.get('baseContract')?.value;
    try {
      this.currentBaseContractJson = JSON.parse(baseContractValue);
    } catch (e) {
      this.currentBaseContractJson = null;
      console.warn('Base Contract is not valid JSON');
    }
  }

  handlePropertySave(propertyData: any) {
    if (this.propertyModalMode === 'edit' && this.selectedPropertyIndex !== null) {
      this.configuredFieldProperties[this.selectedPropertyIndex] = propertyData;
    } else {
      this.configuredFieldProperties.push(propertyData);
    }
    this.isPropertyModalOpen = false;
  }

  handlePropertyCancel() {
    this.isPropertyModalOpen = false;
  }

  removeProperty(index: number) {
    this.configuredFieldProperties.splice(index, 1);
  }
}
