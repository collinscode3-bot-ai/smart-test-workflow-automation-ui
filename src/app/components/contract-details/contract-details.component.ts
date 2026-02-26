import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.scss']
})
export class ContractDetailsComponent implements OnInit {
  mode: 'new' | 'edit' = 'new';
  contractId: string | null = null;
  contractForm: FormGroup;

  // UI State
  schemaMode: 'upload' | 'editor' = 'upload';
  baseContractMode: 'upload' | 'editor' = 'editor';

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
    private fb: FormBuilder
  ) {
    this.contractForm = this.fb.group({
      contractName: ['', Validators.required],
      contractType: ['', Validators.required],
      contractDescription: ['']
    });
  }

  ngOnInit(): void {
    // Mode Detection
    this.route.data.subscribe(data => {
      this.mode = data['mode'] === 'edit' ? 'edit' : 'new';
    });

    this.route.paramMap.subscribe(params => {
      this.contractId = params.get('id');
      if (this.mode === 'edit' && this.contractId) {
        this.loadContract(this.contractId);
      }
    });

    // Header Service Integration
    this.headerService.setHeaderData(
      'Contract Details',
      'Define the structural and baseline data for your test suites by providing schema definitions.'
    );
  }

  loadContract(id: string) {
    // API CALL: GET /api/contracts/{id}
    console.log(`Fetching contract with id: ${id}`);

    // Simulating API response
    const mockResponse = {
      contractName: 'Auth Response Schema',
      contractType: 'Consumer',
      contractDescription: 'Baseline schema for authentication response verification.'
    };
    this.contractForm.patchValue(mockResponse);
  }

  onSave() {
    if (this.contractForm.valid) {
      const formData = this.contractForm.value;
      if (this.mode === 'edit') {
        // API CALL: PUT /api/contracts/{id}
        console.log('Updating contract', this.contractId, formData);
      } else {
        // API CALL: POST /api/contracts
        console.log('Creating new contract', formData);
      }
      this.router.navigate(['/contracts/list']);
    } else {
      this.contractForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/contracts/list']);
  }

  // LOGIC: File upload handler and JSON validation.
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File uploaded:', file.name);
      // Implement file reading and validation logic here
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
}
