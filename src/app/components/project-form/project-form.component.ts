import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  projectForm: FormGroup;
  projectId: string | null = null;

  project: any = {
    name: '',
    description: '',
    category: ''
  };

  private mockProjects = [
    { id: '1', name: 'Q3 Brand Audit', description: 'Reviewing current visual assets across all regional distribution centers for compliance with the new brand guidelines established in the previous quarter. This involves a deep dive into logos, color palettes, and typography used in various marketing materials and physical signage.', category: 'design' },
    { id: '2', name: 'Website Redesign', description: 'Customer portal enhancement project focusing on mobile-first tracking interface...', category: 'web' },
    { id: '3', name: 'App Launch 2024', description: 'Deployment plan for the next generation logistics management application...', category: 'mobile' },
    { id: '4', name: 'API Integration', description: 'Standardizing data exchange protocols between legacy systems and cloud services.', category: 'other' },
    { id: '5', name: 'Market Research', description: 'Analyzing competitor strategies and consumer behavior for the upcoming fiscal year.', category: 'other' },
    { id: '6', name: 'Customer Support Bot', description: 'Implementing AI-driven chatbot to handle common customer inquiries and reduce wait times.', category: 'other' },
    { id: '7', name: 'Data Migration', description: 'Transferring local database records to a secure, distributed cloud infrastructure.', category: 'other' },
    { id: '8', name: 'Security Patching', description: 'Applying critical security updates across all production environments to ensure data integrity.', category: 'other' },
    { id: '9', name: 'User Onboarding Flow', description: 'Optimizing the registration process to improve user retention and conversion rates.', category: 'other' },
    { id: '10', name: 'Internal Wiki', description: 'Building a centralized knowledge base for internal documentation and team collaboration.', category: 'other' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check route data for mode
    this.route.data.subscribe(data => {
      if (data['mode']) {
        this.mode = data['mode'];
      }

      // Check query params for id
      this.route.queryParams.subscribe(params => {
        if (params['id'] && this.mode === 'edit') {
          this.projectId = params['id'];
          this.loadProject(params['id']);
        }
      });

      this.updateHeader();
    });
  }

  private updateHeader(): void {
    const title = this.mode === 'edit' ? 'Edit Project Details' : 'Project Management';
    const description = 'Create, edit, and manage your automation project configurations and metadata.';
    this.headerService.setHeaderData(title, description);
  }

  loadProject(id: string) {
    console.log('Loading project details for ID:', id);
    // Mocking an API call
    const foundProject = this.mockProjects.find(p => p.id === id);
    if (foundProject) {
      this.project = { ...foundProject };
      this.projectForm.patchValue({
        projectName: foundProject.name,
        projectDescription: foundProject.description
      });
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      if (this.mode === 'create') {
        this.save();
      } else {
        this.update();
      }
    } else {
      // Mark all as dirty to show errors if someone tries to submit an empty form
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsDirty();
      });
    }
  }

  save() {
    console.log('Saving project...', this.projectForm.value);
    // API CALL: POST /api/projects (Create)
    /*
    this.projectService.save(this.projectForm.value).subscribe(response => {
       console.log('Project created successfully', response);
    });
    */
  }

  update() {
    console.log('Updating project...', this.projectForm.value);
    // API CALL: PUT /api/projects/' + this.projectId + ' (Update)
    /*
    this.projectService.update(this.projectId, this.projectForm.value).subscribe(response => {
       console.log('Project updated successfully', response);
    });
    */
  }
}
