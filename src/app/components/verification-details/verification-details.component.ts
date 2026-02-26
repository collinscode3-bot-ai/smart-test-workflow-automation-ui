import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { Location } from '@angular/common';

interface VerificationParam {
  id: number;
  paramSequence: number;
  paramKey: string;
}

@Component({
  selector: 'app-verification-details',
  templateUrl: './verification-details.component.html',
  styleUrls: ['./verification-details.component.scss']
})
export class VerificationDetailsComponent implements OnInit {
  mode: 'new' | 'edit' = 'new';
  projectId: string | null = null;
  suiteId: string | null = null;
  caseId: string | null = null;
  verificationId: string | null = null;
  verificationForm: FormGroup;

  // Mock Data
  verificationParams: VerificationParam[] = [
    { id: 1, paramSequence: 1, paramKey: 'tracking_number' },
    { id: 2, paramSequence: 2, paramKey: 'api_key' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private headerService: HeaderService,
    private location: Location
  ) {
    this.verificationForm = this.fb.group({
      appName: ['', Validators.required],
      serviceName: ['', Validators.required],
      sequenceNo: [{ value: 10, disabled: true }, Validators.required],
      verificationParamType: ['', Validators.required],
      baseUrl: ['', Validators.required],
      verifyIfPreviousSuccess: [true],
      verificationKeyTypeIsComposite: [false],
      verificationKeyTypeDelimiter: [':']
    });
  }

  ngOnInit(): void {
    // Mode Detection
    this.route.data.subscribe(data => {
      this.mode = data['mode'] === 'edit' ? 'edit' : 'new';
    });

    // Parameter extraction
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      this.suiteId = params.get('suiteId');
      this.caseId = params.get('caseId');
      this.verificationId = params.get('verificationId');

      if (this.mode === 'edit' && this.verificationId) {
        this.headerService.setHeaderData(
          'Edit Verification',
          'Configure detailed verification steps and parameters for your test case.'
        );
        this.loadVerification(this.verificationId);
      } else {
        this.headerService.setHeaderData(
          'Add Verification',
          'Configure detailed verification steps and parameters for your test case.'
        );
        // In a real app, we might fetch the next sequence number here.
        this.verificationForm.patchValue({ sequenceNo: 10 });
      }
    });
  }

  loadVerification(id: string) {
    // API CALL: GET /api/verifications/{id}
    console.log(`Fetching verification with id: ${id}`);

    // Simulating API response
    const mockResponse = {
      appName: 'Shipment Tracking',
      serviceName: 'TrackServiceV1',
      sequenceNo: 10,
      verificationParamType: 'Query Param',
      baseUrl: 'https://api.fedex.com/track/v1',
      verifyIfPreviousSuccess: true,
      verificationKeyTypeIsComposite: false,
      verificationKeyTypeDelimiter: ':'
    };
    this.verificationForm.patchValue(mockResponse);
  }

  onSave() {
    if (this.verificationForm.valid) {
      const formData = this.verificationForm.getRawValue();
      if (this.mode === 'edit') {
        // API CALL: PUT /api/verifications/{id}
        console.log('Updating verification', this.verificationId, formData);
      } else {
        // API CALL: POST /api/verifications
        console.log('Creating new verification', formData);
      }
      this.location.back();
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.location.back();
  }

  addVerificationParam() {
    console.log('Adding new verification param');
    const nextId = this.verificationParams.length > 0 ? Math.max(...this.verificationParams.map(p => p.id)) + 1 : 1;
    this.verificationParams.push({
      id: nextId,
      paramSequence: nextId,
      paramKey: 'new_param'
    });
  }

  editVerificationParam(param: VerificationParam) {
    console.log('Editing verification param', param);
  }
}
