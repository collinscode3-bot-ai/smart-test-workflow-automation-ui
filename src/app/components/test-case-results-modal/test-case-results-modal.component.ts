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

  // Default mock data with multiple datasets
  datasets: any[] = [
    {
      id: 'ds-001',
      name: "Dataset 1 - Success",
      status: "Passed",
      applicationName: "Smart Workflow API",
      serviceName: "Auth-Service",
      services: [
        { name: "Authentication Service", status: "success", active: false },
        { name: "User Profile Service", status: "success", active: true },
        { name: "Authorization Service", status: "success", active: false },
        { name: "Logging Service", status: "success", active: false }
      ],
      entryPayload: JSON.stringify({
        "requestId": "req_9921",
        "timestamp": "2023-11-05T10:00:00Z",
        "user_id": "usr_1a2b3c4d",
        "action": "LOGIN"
      }, null, 2),
      exitPayload: JSON.stringify({
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires_in": 3600
      }, null, 2),
      validations: [
        { name: "user_id_format", value: "\"usr_1a2b3c4d\"", status: "PASSED" },
        { name: "token_presence", value: "true", status: "PASSED" },
        { name: "response_time", value: "145ms", status: "PASSED" }
      ]
    },
    {
      id: 'ds-002',
      name: "Dataset 2 - Failed",
      status: "Failed",
      applicationName: "Smart Workflow API",
      serviceName: "Auth-Service",
      services: [
        { name: "Authentication Service", status: "success", active: false },
        { name: "User Profile Service", status: "error", active: true }
      ],
      entryPayload: JSON.stringify({
        "requestId": "req_9922",
        "timestamp": "2023-11-05T10:05:00Z",
        "user_id": "invalid_id",
        "action": "LOGIN"
      }, null, 2),
      exitPayload: JSON.stringify({
        "status": "error",
        "message": "User not found",
        "code": "AUTH_001"
      }, null, 2),
      validations: [
        { name: "user_id_format", value: "\"invalid_id\"", status: "FAILED" },
        { name: "error_code", value: "\"AUTH_001\"", status: "PASSED" }
      ]
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.executionData && this.executionData.datasets) {
      this.datasets = this.executionData.datasets;
    }
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
