import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-test-case-results-modal',
  templateUrl: './test-case-results-modal.component.html',
  styleUrls: ['./test-case-results-modal.component.scss']
})
export class TestCaseResultsModalComponent implements OnInit {
  @Input() executionData: any;
  @Output() close = new EventEmitter<void>();

  // Tracks selected service index for each dataset
  selectedServiceIndices: { [datasetId: string]: number } = {};

  // Default mock data with service-level details
  datasets: any[] = [
    {
      id: 'ds-001',
      name: "Dataset 1 - Success",
      status: "Passed",
      applicationName: "Smart Workflow API",
      serviceName: "Auth-Service",
      services: [
        {
          name: "Authentication Service",
          status: "success",
          entryPayload: JSON.stringify({ "action": "AUTH", "user": "jules" }, null, 2),
          exitPayload: JSON.stringify({ "status": "authenticated", "uid": "123" }, null, 2),
          validations: [{ name: "auth_token", value: "valid", status: "PASSED" }]
        },
        {
          name: "User Profile Service",
          status: "success",
          entryPayload: JSON.stringify({ "get": "profile", "uid": "123" }, null, 2),
          exitPayload: JSON.stringify({ "name": "Jules", "role": "Engineer" }, null, 2),
          validations: [{ name: "profile_fields", value: "complete", status: "PASSED" }]
        },
        {
          name: "Authorization Service",
          status: "success",
          entryPayload: JSON.stringify({ "check": "perm", "uid": "123" }, null, 2),
          exitPayload: JSON.stringify({ "allowed": true }, null, 2),
          validations: [{ name: "permission_check", value: "granted", status: "PASSED" }]
        }
      ]
    },
    {
      id: 'ds-002',
      name: "Dataset 2 - Failed",
      status: "Failed",
      applicationName: "Smart Workflow API",
      serviceName: "Auth-Service",
      services: [
        {
          name: "Authentication Service",
          status: "success",
          entryPayload: JSON.stringify({ "action": "AUTH", "user": "unknown" }, null, 2),
          exitPayload: JSON.stringify({ "status": "authenticated", "uid": "999" }, null, 2),
          validations: [{ name: "auth_token", value: "valid", status: "PASSED" }]
        },
        {
          name: "User Profile Service",
          status: "error",
          entryPayload: JSON.stringify({ "get": "profile", "uid": "999" }, null, 2),
          exitPayload: JSON.stringify({ "error": "not_found" }, null, 2),
          validations: [{ name: "user_exists", value: "false", status: "FAILED" }]
        }
      ]
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.executionData && this.executionData.datasets) {
      this.datasets = this.executionData.datasets;
    }
    // Initialize default selections (first service for each dataset)
    this.datasets.forEach(ds => {
      this.selectedServiceIndices[ds.id] = 0;
    });
  }

  selectService(datasetId: string, index: number): void {
    this.selectedServiceIndices[datasetId] = index;
  }

  getSelectedService(dataset: any): any {
    const index = this.selectedServiceIndices[dataset.id] || 0;
    return dataset.services[index];
  }

  formatJson(json: string): SafeHtml {
    if (!json) return '';

    const highlighted = json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:')
      .replace(/:\s*"([^"]*)"/g, ': <span class="json-string">"$1"</span>')
      .replace(/:\s*(\d+|true|false|null)/g, ': <span class="json-value">$1</span>');

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  getStatusBadgeClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'passed' || s === 'success') return 'badge-passed';
    if (s === 'failed' || s === 'error') return 'badge-failed';
    return 'badge-pending';
  }

  onClose(): void {
    this.close.emit();
  }
}
